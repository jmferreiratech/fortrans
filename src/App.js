import React, {Component} from 'react';
import Autocomplete from "react-toolbox/lib/autocomplete/Autocomplete";
import Snackbar from "react-toolbox/lib/snackbar/Snackbar";
import Button from "react-toolbox/lib/button/Button";
import Chip from "react-toolbox/lib/chip/Chip";
import DatePicker from "react-toolbox/lib/date_picker/DatePicker";
import Avatar from "react-toolbox/lib/avatar/Avatar";
import Tabs from "react-toolbox/lib/tabs/Tabs";
import Tab from "react-toolbox/lib/tabs/Tab";

import BusLineRepository from "./persistence/BusLineRepository";
import BusScheduleService from "./services/BusScheduleService";
import DatesUtils from "./utils/DatesUtils";

const accessible = require("./resources/images/accessibility-80.jpg");
const nAccessible = require("./resources/images/nacessivel2.gif");
const loader = require("./resources/images/ajax-loader2.gif");

class App extends Component {

    constructor() {
        super();
        this.state = {
            loadingLines: "Carregando linhas, aguarde...",
            loadingSchedules: false,
            error: "",
            lines: [],
            selectedLine: "",
            selectedDate: new Date(),
            selectedTabIndex: 0,
            loadedLine: "",
            loadedDate: new Date(),
            loadedSchedules: [],
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeLine = this.handleChangeLine.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleChangeTab = this.handleChangeTab.bind(this);
    }

    componentDidMount() {
        BusLineRepository().all()
            .then(lines => lines.sort((a, b) => -DatesUtils().compare(a.lastAccess, b.lastAccess)))
            .then(lines => {
                this.setState(() => ({
                    loadingLines: "",
                    lines
                }));
            })
            .then(() => BusScheduleService().deleteOldDays())
            .then(() => BusScheduleService().prefetchTopLines());
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState(() => ({
            error: "",
            loadingSchedules: true,
        }));
        const {selectedDate, selectedLine, lines} = this.state;
        const lineNumber = lines.find(line => line.numeroNome === selectedLine).numero;
        BusScheduleService().get(lineNumber, selectedDate)
            .then(loadedSchedules => {
                this.setState(() => ({
                    loadingSchedules: false,
                    loadedSchedules,
                    loadedLine: selectedLine,
                    loadedDate: selectedDate,
                }));
            })
            .catch(() => {
                this.setState(() => ({
                    loadingSchedules: false,
                    error: "Não há horários para essa linha nesse dia.",
                }));
            })
            .then(() => BusScheduleService().deleteOldLines())
            .then(() => BusScheduleService().prefetchNextDays(lineNumber));
    }

    handleChangeLine(selectedLine) {
        this.setState({selectedLine});
    }

    handleChangeDate(selectedDate) {
        this.setState({selectedDate});
    }

    handleChangeTab(selectedTabIndex) {
        this.setState({selectedTabIndex});
    }

    render() {
        const {
            loadingLines,
            error,
            loadedSchedules,
            loadedLine,
            loadedDate,
            loadingSchedules,
            lines,
            selectedLine,
            selectedDate,
            selectedTabIndex} = this.state;

        const minDate = new Date();
        minDate.setDate(minDate.getDate() - 2);

        return (
            <div className='container-fluid'>
                <h1>
                    Horários da Linha
                </h1>
                {loadingLines && <Snackbar
                    action='Ok'
                    label={loadingLines}
                    active={!!loadingLines}
                    ref='snackbar'
                    type='accept'
                />}
                {error && <Snackbar
                    action='Ok'
                    label={error}
                    active={!!error}
                    ref='snackbar'
                    type='warning'
                />}

                {lines.length > 0 && <form name="consulta_linha" onSubmit={this.handleSubmit}>
                    <Autocomplete
                        label="Escolha a linha"
                        onChange={this.handleChangeLine}
                        source={lines.map(line => line.numeroNome)}
                        value={selectedLine}
                        multiple={false}
                        suggestionMatch="anywhere"
                        showSuggestionsWhenValueIsSet={true}
                    />
                    <DatePicker label='Data da consulta'
                                sundayFirstDayOfWeek
                                locale="pt"
                                cancelLabel="Cancelar"
                                minDate={minDate}
                                value={selectedDate}
                                onChange={this.handleChangeDate}
                    />
                    <br/>
                    <Button label='Consultar' raised primary onClick={this.handleSubmit}/>
                </form>}
                <hr/>

                {loadingSchedules && <img src={loader} alt=""/>}

                {!error && !loadingSchedules && <div>
                    {loadedLine && <div>
                        <h3>
                            Linha {loadedLine} - {DatesUtils().toDisplay(loadedDate)}
                        </h3>
                        <h3>
                            Horários de Saídas:
                        </h3>
                    </div>}
                    <Tabs inverse fixed onChange={this.handleChangeTab} index={selectedTabIndex}>
                        {loadedSchedules.map(listaHorarios => (
                            <Tab key={listaHorarios.postoControle} label={listaHorarios.postoControle.trim()}>
                                <section>
                                {listaHorarios.horarios.map(item => (
                                    <Schedule key={item.horario} item={item}/>
                                ))}
                                </section>
                            </Tab>
                        ))}
                    </Tabs>
                </div>}
                <br/>
            </div>
        );
    }
}

function Schedule(props) {
    const isAccessible = props.item.acessivel === 'sim';
    return (
        <Chip>
            <Avatar>
                {isAccessible ?
                    <img src={accessible} title="Veículo Acessível" alt=""/> :
                    <img src={nAccessible} title="Veículo Não é Acessível" alt=""/>}
            </Avatar>
            {DatesUtils().hourString() > props.item.horario ?
                <span style={{textDecoration: 'line-through'}}>{props.item.horario}</span> :
                <strong>{props.item.horario}</strong>}
        </Chip>
    );
}

export default App;
