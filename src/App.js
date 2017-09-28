import React, {Component} from 'react';
import Dropdown from "react-toolbox/lib/dropdown/Dropdown";
import Snackbar from "react-toolbox/lib/snackbar/Snackbar";
import Button from "react-toolbox/lib/button/Button";
import Chip from "react-toolbox/lib/chip/Chip";
import DatePicker from "react-toolbox/lib/date_picker/DatePicker";
import Avatar from "react-toolbox/lib/avatar/Avatar";
import Tabs from "react-toolbox/lib/tabs/Tabs";
import Tab from "react-toolbox/lib/tabs/Tab";

const accessible = require("./resources/images/acessivel.gif");
const nAccessible = require("./resources/images/nacessivel2.gif");
const accessibleIcon = require("./resources/images/acessivel.ico");
const loader = require("./resources/images/ajax-loader2.gif");

class App extends Component {

    constructor() {
        super();
        this.state = {
            loadingLinhas: " Carregando linhas, aguarde...",
            linhas: [],
            linha: '',
            erro: '',
            horariosPontos: [],
            dt: new Date(),
            tabIndex: 0,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeLine = this.handleChangeLine.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleChangeTab = this.handleChangeTab.bind(this);
    }

    componentDidMount() {
        fetch("https://etufor-proxy.herokuapp.com/api/linhas/")
            .then(response => response.json())
            .then(data => {
                this.setState(() => ({
                    loadingLinhas: '',
                    linhas: data.map(item => ({value: item.numeroNome, label: item.numeroNome})),
                }));
            });
    }

    handleSubmit(event) {
        event.preventDefault();
        const {dt, linha} = this.state;

        if (!linha || linha.indexOf("-") < 1) {
            this.setState(() => ({
                erro: "Linha não identificada, digite o nome corretamente e selecione a linha.",
                selected: "",
            }));
            return false;
        } else {
            this.setState(() => ({
                erro: "",
                selected: "",
                loadingHorarios: true,
                linhaConsultada: linha,
                dataSelecionada: pad(dt.getDate(), 2) + '/' + pad(dt.getMonth() + 1, 2) + '/' + dt.getFullYear(),
            }));
        }
        const numeroLinha = linha.substring(0, 3);
        const data = dt.getFullYear() + pad(dt.getMonth() + 1, 2) + pad(dt.getDate(), 2);
        fetch("https://etufor-proxy.herokuapp.com/api/horarios/" + numeroLinha + '?data=' + data)
            .then(response => response.json())
            .then(horariosPontos => {
                this.setState(() => ({
                    loadingHorarios: false,
                    horariosPontos,
                }));
            })
            .catch(() => {
                this.setState(() => ({
                    loadingHorarios: false,
                    erro: "Não há horários para essa linha nesse dia.",
                }));
            });
    }

    handleChangeLine(linha) {
        this.setState({linha});
    }

    handleChangeDate(dt) {
        this.setState({dt});
    }

    handleChangeTab(tabIndex) {
        this.setState({tabIndex});
    }

    render() {
        const {loadingLinhas, erro, horariosPontos, linhaConsultada, dataSelecionada, loadingHorarios, linhas, linha, dt, tabIndex} = this.state;

        return (
            <div className='container-fluid'>
                <h1>
                    Horários da Linha
                </h1>
                {loadingLinhas && <Snackbar
                    action='Ok'
                    label={loadingLinhas}
                    active={!!loadingLinhas}
                    ref='snackbar'
                    type='accept'
                />}
                {erro && <Snackbar
                    action='Ok'
                    label={erro}
                    active={!!erro}
                    ref='snackbar'
                    type='warning'
                />}

                {!loadingLinhas && <form name="consulta_linha" onSubmit={this.handleSubmit}>
                    <Dropdown
                        label="Linha"
                        auto
                        onChange={this.handleChangeLine}
                        source={linhas}
                        value={linha}
                    />
                    <DatePicker label='Data da consulta' sundayFirstDayOfWeek value={dt}
                                onChange={this.handleChangeDate}/>
                    <br/>
                    <Button label='Consultar' raised primary onClick={this.handleSubmit}/>
                </form>}
                <hr/>

                {loadingHorarios && <img src={loader}/>}

                {!erro && <div>
                    {!loadingHorarios && <div>
                        {linhaConsultada && <div>
                            <h3>
                                Linha {linhaConsultada}
                            </h3>
                            <h3>
                                Dia {dataSelecionada}
                            </h3>
                            <h3>
                                Horários de Saídas:
                            </h3>
                            <h5><img src={accessibleIcon}/> - Veículo Acessível</h5>
                        </div>}
                        <Tabs inverse fixed onChange={this.handleChangeTab} index={tabIndex}>
                            {horariosPontos.map(listaHorarios => (
                                <Tab key={listaHorarios.postoControle} label={listaHorarios.postoControle.trim()}>
                                    <section>
                                    {listaHorarios.horarios.map(item => (
                                        <Chip key={item.horario}>
                                            <Avatar>
                                                {item.acessivel === 'sim' &&
                                                <img src={accessible} title="Veículo Acessível"/>}
                                                {item.acessivel === 'nao' && <img src={nAccessible}
                                                                                  title="Veículo Não é Acessível"/>}
                                            </Avatar>
                                            <span>{item.horario}</span>
                                        </Chip>
                                    ))}
                                    </section>
                                </Tab>
                            ))}
                        </Tabs>
                    </div>}
                </div>}
                <br/>
            </div>
        );
    }
}

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

export default App;
