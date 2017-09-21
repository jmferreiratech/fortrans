(function () {
    var app = angular.module("gistApi", ['ui.bootstrap']);

    var linHorariosCtrl = function ($scope, $http) {

        $scope.isCollapsed = true;

        //---------------------------------------------------------------
        var onLinhasCompleted = function (response) {
            var linhas = [];

            for (var item in response.data) {

                linhas.push(response.data[item].numeroNome);
            }

            $scope.linhas = linhas;

            $scope.loadingLinhas = null;
        };

        $scope.loadingLinhas = " Carregando linhas, aguarde...";

        $http.get("http://gistapis.etufor.ce.gov.br:8081/api/linhas/")
        .then(onLinhasCompleted);

        //---------------------------------------------------------------

        var onHorariosComplete = function (response) {
            var horariosPontos = [];
            $scope.erro = null;

            for (var item in response.data) {
                horariosPontos.push(response.data[item]);
            }

            $scope.horariosPontos = horariosPontos;

            $scope.loadingHorarios = false;

        };

        var onHorariosError = function (status) {
            $scope.erro = "Não há horários para essa linha nesse dia.";
            $scope.loadingHorarios = false;
        }

        $scope.consultar = function (linha) {

            var numeroLinha; 
            var data = $scope.dt.getFullYear() + pad($scope.dt.getMonth() + 1, 2) + pad($scope.dt.getDate(), 2);

            if (linha == null || linha == "" || linha.indexOf("-") < 1) {
                $scope.erro = "Linha não identificada, digite o nome corretamente e selecione a linha.";
                $scope.selected = "";
                foco("search");
                return false;
            } else {
                $scope.erro = null;
                numeroLinha = linha.substring(0, 3);
            }

            $scope.loadingHorarios = true;

            $http.get("http://gistapis.etufor.ce.gov.br:8081/api/horarios/" + numeroLinha + '?data=' + data)
            .then(onHorariosComplete, onHorariosError);

            $scope.linhaConsultada = linha;
            $scope.dataSelecionada = pad($scope.dt.getDate(), 2) + '/' + pad($scope.dt.getMonth() + 1, 2) + '/' + $scope.dt.getFullYear();

        };

        //---------------------------------------------------------------
        //Datepicker

        $scope.today = function () {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        // Disable weekend selection
        $scope.disabled = function (date, mode) {
            return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
        };

        $scope.toggleMin = function () {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1
        };

        $scope.initDate = new Date('2016-15-20');
        $scope.formats = ['dd/MM/yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

        //---------------------------------------------------------------

    };

    app.controller("linHorariosCtrl", linHorariosCtrl);

} ());

