var importedReportsVM = {
    init: function () {
        var that = this;
        $("#items-grid").kendoGrid({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        $.ajax({
                            url: globalVars.consts.AbsoluteUri + "/Common/Auction/SearchAuctions",
                            dataType: "json",
                            data: that.parseFilters(options),
                            type: "GET",
                            success: function (result) {
                                if (result.isSuccess) {
                                    $.each(result.data.Items, function (k, v) {
                                        result.data.Items[k].Id = k;
                                        if(!v.SubsoilId)
                                            result.data.Items[k].SubsoilId = "";
                                    });
                                    options.success(result.data);
                                } else
                                    options.success({
                                        Items: [],
                                        Total: 0
                                    });
                            },
                            error: function (error, textStatus) {
                                options.success({
                                    Items: [],
                                    Total: 0
                                });
                                console.log(error);
                            }

                        });
                        options.success({
                            Items: [],
                            Total: 0
                        });
                    },
                    parameterMap: function (data, operation) {
                        return JSON.stringify(data);
                    },
                },
                schema: {
                    data: "Items",
                    total: "Total",
                    model: {
                        id: "Id",
                        fields: {
                            Date: { type: "date" }
                        }
                    },
                    errors: function (response) {
                        return response.Error;
                    },
                },
                // sort: { field: "Name", dir: "asc" },
                pageable: true,
                pageSize: 15,
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true,
            }),
            // определяем колонки грида
            columns: [
                {
                    field: "SourceType",
                    title: "Вид источника",
                    template: "Торги",
                    filterable: false,/* {
                        ui: function cityFilter(element) {
                            element.kendoDropDownList({
                                dataSource: that.sourceTypesDataSource,
                                optionLabel: "--Выберите значение--",
                                dataTextField: "Name",
                                dataValueField: "Id",
                            });
                        }
                    }*/
                },
                {
                    field: "Subsoil",
                    title: "Наименование УН в  источнике"
                },
                {
                    field: "BidNumber",
                    title: "Номер"
                },
                {
                    field: "Mineral",
                    title: "Вид полезного ископаемого",
                    filterable: false
                },
                {
                    field: "SubjectRF",
                    title: "Субъект РФ",
                    filterable: false
                },
                {
                    field: "Date",
                    title: "Дата записи",
                    filterable: {
                        extra: true,
                        ui: function (element) {
                            element.kendoDatePicker({
                                format: "dd.MM.yyyy"
                            }).data("kendoDatePicker");
                        }
                    },
                    template: function (model) {
                        return moment(model.Date).format("DD.MM.YYYY");
                    }
                },
                {
                    field: "SubsoilId",
                    title: "ID участка в Недра-Эксперт",
                    filterable: false,
                    template: "<input type='text' style='width:110px' id='subsurface_#= Id #' value='#= SubsoilId #'/>"
                },
                {
                    command: [
                            {
                                name: 'ChangeAdmin',
                                title: "Связать",
                                text: '<i class="fa fa-plus"></i>',
                                click: function (e) {
                                    var tr = $(e.target).closest("tr");
                                    var data = this.dataItem(tr);
                                    if (!!$("#subsurface_" + data.Id).val()) {
                                        $("#subsurface_" + data.Id).removeClass("validation-error");
                                        $.ajax({
                                            url: globalVars.consts.AbsoluteUri + "/Common/Auction/BindAuction",
                                            dataType: "json",
                                            data: {
                                                number: data.BidNumber,
                                                subsurfaceId: $("#subsurface_" + data.Id).val()
                                            },
                                            type: "GET",
                                            success: function (result) {
                                                if (!result.isSuccess)
                                                    alert(result.error);
                                            },
                                            error: function (error, textStatus) {
                                                console.log(error);
                                            }

                                        });
                                    } else {
                                        $("#subsurface_" + data.Id).addClass("validation-error");
                                    }
                                    return false;
                                },
                            }
                    ],
                    title: "",
                    width: 60
                }
            ],
            resizable: false,
            //reorderable: true,
            editable: false,
            pageSize: 15,
            pageable: true,
            sortable: false,
            filterable: {
                extra: false,
                operators: {
                    string: {
                        startswith: "Начинается с",
                        eq: "Равно",
                        neq: "Не равно"
                    },
                    date: {
                        gt: "c",
                        lt: "по"
                    }
                },
                messages: {
                    and: "и",
                    or: "или",
                    filter: "Применить",
                    clear: "Очистить",
                    info: "Фильтрация"
                }
            },
            filterMenuInit: function (e) {
                var eq = ":eq(0)";
                if (e.field == "Date")
                    eq = ":eq(1)";

                setTimeout(function () {
                    var firstValueDropDown = e.container.find("select" + eq).data("kendoDropDownList");
                    firstValueDropDown.wrapper.hide();
                });
            },
            dataBound: function () {
            }
        });
    },

    // helpers
    parseFilters: function (options) {
        var data = {
            skip: 0,
            take: 10,
            sourceType: "Торги",
            subjectName: "",
            number: "",
            dateStart: null,
            dateEnd: null,
        };

        if (options) {
            if (options.data) {
                data.skip = (options.data.page - 1) * options.data.pageSize;
                data.take = options.data.pageSize;

                if (options.data.filter && options.data.filter.filters) {
                    $.each(options.data.filter.filters, function (k, v) {
                        switch (v.field) {
                            case "SourceType":
                                data.sourceType = v.value;
                                break;
                            case "BidNumber":
                                data.number = v.value;
                                break;
                            case "Subsoil":
                                data.subjectName = v.value;
                                break;
                            case "Date":
                                console.log(v);
                                if (v.operator == "gt")
                                    data.dateStart = v.value
                                else if (v.operator == "lt")
                                    data.dateEnd = v.value;
                                break;
                            default:
                                break;
                        }
                    });
                }
            }
        }

        return data;
    },

    // datasources
    sourceTypesDataSource: new kendo.data.DataSource({
        transport: {
            read: function(options){
                /*url: globalVars.consts.AbsoluteUri + "/api/subsurface/geological_formation_types?withNull=true",
                dataType: "json",
                type: "GET"*/
                options.success([
                    {
                        Id: "Торги",
                        Name: "Торги"
                    }
                ]);
            },
            parameterMap: function (data, operation) {
                return JSON.stringify(data);
            }
        },
        schema: {
            errors: function (response) {
                return response.Error;
            }
        },
        error: function (error) {
            console.log(error.responseJSON);
        },
    })
}

$(document).ready(function () {
    window.importedReportsVM = kendo.observable(importedReportsVM);
    kendo.bind($("#edit-form"), window.importedReportsVM);

    window.importedReportsVM.init();
});