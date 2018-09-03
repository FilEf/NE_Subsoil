var editVM = {
    errorMessage: "Такого объекта не существует",
    document: {
        Id: 0,
        AdminOnly: false,
        Type: "",
        Name: "",
        Price: 0,
        Minerals: "",
        Parents: [],
        ConnectedDocs: []
    },
    errors: [],

    init: function () {
        var that = this;

        var url = globalVars.consts.AbsoluteUri + "/api/document/get_empty";
        if (documentId > 0) {
            url = globalVars.consts.AbsoluteUri + "/api/document/get_document/" + documentId;
        }

        $.ajax({
            url: url,
            dataType: "json",
            type: "GET",
            success: function (result) {
                if (result) {
                    console.log(result, "document get");
                    that.set('document', result);
                    $("#document-objects-grid").data("kendoGrid").dataSource.read();
                    $("#related-docs-grid").data("kendoGrid").dataSource.read();
                }
            }
        });

        $("#document-objects-grid").kendoGrid({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        var document = that.get('document');
                        var items = [];
                        if (!!document.Parents && document.Parents.length > 0) {
                            $.each(document.Parents, function (k, v) {
                                if (v.Auction || v.Document || v.License || v.Organization || v.Subsurface || v.FutureUsability)
                                    items.push(v);
                            });
                        }
                        options.success(items);
                    },
                    parameterMap: function (data, operation) {
                        return JSON.stringify(data);
                    },
                },
                schema: {
                    errors: function (response) {
                        return response.Error;
                    },
                },
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true,
            }),
            columns: [
                {
                    command: [
                        {
                            name: 'Delete',
                            text: '<i class="fa fa-trash-o"></i>',
                            click: function (e) {
                                var tr = $(e.target).closest("tr");
                                var data = this.dataItem(tr);
                                var grid = this;
                                if (confirm("Вы действительно хотите удалить " + that.getObjName(data) + "?")) {
                                    var document = that.get('document');
                                    document.Parents = grid.dataSource.data().filter(function (i) {
                                        return i !== data;
                                    });
                                    that.set('document', document);
                                    grid.dataSource.read();
                                }
                                return false;
                            },
                        }
                    ],
                    title: "",
                    width: 50
                },
                {
                    title: "Тип объекта",
                    template:
                    "# if (data.Subsurface) { # Участок недр " +
                    "# } else if (data.License) { # Лицензия " +
                    "# } else if (data.Organization) { # Недропользователь " +
                    "# } else if (data.Auction) { # Торги " +
                    "# } else if (data.Document) { # Документ " +
                    "# } else if (data.FutureUsability) { # ППП " +
                    "# } #"
                },
                {
                    title: "Объект",
                    template:
                    "# if (data.Subsurface) { # #: data.Subsurface.Name # " +
                    "# } else if (data.License) { # Лицензия #: data.License.Serial ##: data.License.Number # " +
                    "# } else if (data.Organization) { # #: data.Organization.Name # " +
                    "# } else if (data.Auction) { # Торги для УН #: data.Auction.Subsurface.Name # " +
                    "# } else if (data.Document) { # #: data.Document.Name # " +
                    "# } else if (data.FutureUsability) { # Документ №#:data.FutureUsability.DocumentNumber # " +
                    "# } #"
                }
            ],
            toolbar: kendo.template($("#document-objects-grid-toolbar").html()),
            resizable: false,
            pageable: false,
            sortable: false
        });

        $("#document-obj-type-id").kendoDropDownList({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: that.objectTypes,
            index: 0
        });

        $("#document-obj-add").bind('click', function () {
            that.addObjToDocument();
        });

        $("#related-docs-grid").kendoGrid({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        var document = that.get('document');
                        var items = [];
                        if (!!document.ConnectedDocs && document.ConnectedDocs.length > 0) {
                            $.each(document.ConnectedDocs, function (k, v) {
                                items.push(v);
                            });
                        }
                        options.success(items);
                    },
                    parameterMap: function (data, operation) {
                        return JSON.stringify(data);
                    },
                },
                schema: {
                    errors: function (response) {
                        return response.Error;
                    },
                },
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true,
            }),
            // определяем колонки грида
            columns: [
                {
                    command: [
                        {
                            name: 'Delete',
                            text: '<i class="fa fa-trash-o"></i>',
                            click: function (e) {
                                var tr = $(e.target).closest("tr");
                                var data = this.dataItem(tr);
                                var grid = this;
                                if (confirm("Вы действительно хотите удалить документ '" + data.Name + "' ?")) {
                                    var document = that.get('document');
                                    document.ConnectedDocs = grid.dataSource.data().filter(function (i) {
                                        return i !== data;
                                    });
                                    that.set('document', document);
                                    grid.dataSource.read();
                                }
                                return false;
                            },
                        }
                    ],
                    title: "",
                    width: 50
                },
                {
                    field: "Name",
                    title: "Документ"
                }
            ],
            toolbar: kendo.template($("#related-docs-grid-toolbar").html()),
            resizable: false,
            pageable: false,
            sortable: false
        });

        $("#related-docs-add").bind('click', function () {
            that.addRelatedDocToDocument();
        });

    },


    // file 
    getVisibleFileUpload: function(){
        var document = this.get('document')
        return !!document && !document.FileName;
    },
    getVisibleFile: function () {
        var result = false;
        var document = $.extend({}, this.get('document'));
        if (!!document && !!document.FileName) {
            result = true;
        }
        return result;
    },
    getTextFile: function () {
        var result = "";
        var document = $.extend({}, this.get('document'));
        if (!!document && (!!document.FileName || document.FileNameOriginal)) {
            result = document.FileNameOriginal ? document.FileNameOriginal : document.FileName;
        }
        return result;
    },
    fileOnUpload: function (e) {
        var document = $.extend({}, this.get('document'));

        if (!!document && !!e.response && !!e.response.isSuccess) {
            document.FileName = e.response.filename;
            document.FileSize = e.response.fileSize;
            document.FileExtension = e.response.fileExtension;
            document.FileNameOriginal = this.fileName;
            this.set('document', document);
        }
    },
    fileName: "",
    fileOnSelect: function (e) {
        if (!!e && !!e.files && e.files.length > 0) {
            this.fileName = e.files[0].name;
        }
        $("input[name='document-file-name']").closest(".k-dropzone").find(".k-upload-status > span").show();
    },
    removeFile: function () {
        var document = $.extend({}, this.get('document'));

        if (!!document && !!document.FileName) {
            document.FileName = "";
            document.FileSize = "";
            document.FileExtension = "";
            document.FileNameOriginal = "";
            $("input[name='document-file-name']").closest(".k-dropzone").find(".k-upload-status > span").hide();

            this.set('document', document);
        }
    },

    addObjToDocument: function () {
        var that = this;

        that.hideError();

        var document = $.extend({}, this.get('document'));
        var id = $("#document-obj-id").val();
        var typeId = $("#document-obj-type-id").data('kendoDropDownList').value();

        console.log("id = ", id);
        console.log("typeId = ", typeId);

        if (id && typeId) {
            var duplicate = false;
            document.Parents.forEach(function (currentValue, index, array) {
                if (typeId == docVars.enums.ObjectTypes.Subsurface && currentValue.Subsurface && currentValue.Subsurface.Id == id) {
                    duplicate = true;
                } else if (typeId == docVars.enums.ObjectTypes.License && currentValue.License && currentValue.License.Id == id) {
                    duplicate = true;
                } else if (typeId == docVars.enums.ObjectTypes.Organization && currentValue.Organization && currentValue.Organization.Id == id) {
                    duplicate = true;
                } else if (typeId == docVars.enums.ObjectTypes.Auction && currentValue.Auction && currentValue.Auction.Subsurface.Id == id) {
                    duplicate = true;
                } else if (typeId == docVars.enums.ObjectTypes.Document && currentValue.Document && currentValue.Document.Id == id) {
                    duplicate = true;
                } else if (typeId == docVars.enums.ObjectTypes.PPP && currentValue.FutureUsability && currentValue.FutureUsability.Id == id) {
                    duplicate = true;
                }
            });
            if (!duplicate) {
                that.getObject(typeId, id, function (obj) {
                    if (obj) {
                        // проверка на дубликаты
                        console.log(obj, "obj");
                        document.Parents.push(obj);
                        that.set('document', document);
                        $("#document-objects-grid").data("kendoGrid").dataSource.read();

                    } else {
                        that.showError("Объект не найден.");
                    }
                });
                
            } else {
                that.showError("Объект уже добавлен.");
            }
            
        } else {
            that.showError('Объект не указан.');
        }
    },

    addRelatedDocToDocument: function () {
        var that = this;

        that.hideDocError();

        var document = $.extend({}, this.get('document'));
        var id = $("#related-docs-id").val();

        if (id) {
            that.getDocument(id, function (doc) {
                if (doc) {
                    // проверка на самого себя
                    if (doc.Id == document.Id) {
                        that.showDocError("Нельзя добавить этот документ.");
                    } else {
                        // проверка на дубликаты
                        var duplicate = false;
                        document.ConnectedDocs.forEach(function (currentValue) {
                            if (currentValue.Id == doc.Id) {
                                duplicate = true;
                            }
                        });

                        if (!duplicate) {
                            // тут наконец-то нам ничего не мешает добавить
                            doc.Id = 0;
                            doc.ParentGeoDocumentId = document.Id;
                            doc.GeoDocumentId = id;
                            document.ConnectedDocs.push(doc);
                            $("#related-docs-grid").data("kendoGrid").dataSource.read();
                        } else {
                            that.showDocError("Документ уже добавлен.");
                        }
                    }
                } else {
                    that.showDocError("Документ не найден.");
                }
            });
        } else {
            that.showDocError('Id документа не указан.');
        }
    },

    saveDocument: function (e) {
        var that = this;

        $(e.target).prop("disabled", true);
        var data = $.extend({}, this.get('document'));
        this.set('errors', []);
        var errors = [];

        if (!!data) {
            var valid = true;
            if (typeof (data.TypeId) == "undefined" || !data.TypeId) {
                valid = false;
                $("input[name='document-type']").closest("span").addClass("validation-error");
                errors.push("Поле 'Вид документа' является обязательным.");
            }
            if (!data.Name) {
                valid = false;
                $("input[name='document-name']").addClass("validation-error");
                errors.push("Поле 'Название документа' является обязательным.");
            }

            if (!!data.Date) {
                data.Date = moment(data.Date).format("YYYY-MM-DDT12:00:00");
            }

            if (!!data.CreateDate) {
                data.CreateDate = moment(data.CreateDate).format("YYYY-MM-DDT12:00:00");
            }
            
            console.log(data, "save");

            if (valid) {
                $.ajax({
                    url: globalVars.consts.AbsoluteUri + "/api/document/update",
                    dataType: "json",
                    data: { m: JSON.stringify(data) },
                    type: "POST",
                    success: function (result) {
                        $(e.target).prop("disabled", false);
                        console.log(result, "save result");
                        if (result.IsSuccessful) {
                            window.location.href = globalVars.consts.AbsoluteUri + '/document/' + result.Id;
                        }
                        else {
                            that.set('errors', ['В процессе сохранения возникла ошибка. Повторите попытку позже.']);
                            $("html, body").animate({ scrollTop: 0 }, "slow");
                        }
                    }
                });
            } else {
                $(e.target).prop("disabled", false);
                this.set('errors', errors);
                $("html, body").animate({ scrollTop: 0 }, "slow");
            }
        } else {
            $(e.target).prop("disabled", false);
        }
    },

    //
    // private methods
    //

    getObjName: function (data) {
        var retVal = "объект";
        if (data) {
            if (data.Subsurface) {
                retVal = "УН " + data.Subsurface.Name;
            } else if (data.License) {
                retVal = "лицензию " + data.License.Serial + data.License.Number;
            } else if (data.Organization) {
                retVal = "недропользователя " + data.Organization.Name;
            } else if (data.Auction) {
                retVal = "торги для УН " + data.Auction.Subsurface.Name;
            } else if (data.Document) {
                retVal = "документ " + data.Document.Name;
            }
        }
        return retVal;
    },

    hideError: function () {
         $("#document-obj-add-fail").hide();
    },
    showError: function (errorText) {
        $("#document-obj-add-fail").text(errorText);
        $("#document-obj-add-fail").show();
    },
    hideDocError: function () {
         $("#related-docs-add-fail").hide();
    },
    showDocError: function (errorText) {
        $("#related-docs-add-fail").text(errorText);
        $("#related-docs-add-fail").show();
    },
    getObject: function (typeId, id, callback) {
        var that = this;
        switch (+typeId) {
            case docVars.enums.ObjectTypes.Subsurface: // "Участок недр"
                that.getSubsurface(id, callback);
                break;
            case docVars.enums.ObjectTypes.License: // "Лицензия"
                that.getLicenseInfo(id, callback);
                break;
            case docVars.enums.ObjectTypes.Organization: // "Недропользователь"
                that.getOrganizationInfo(id, callback);
                break;
            case docVars.enums.ObjectTypes.Auction: // "Торги"
                that.getAuctionInfo(id, callback);
                break;
            case docVars.enums.ObjectTypes.Document: // "Документ"
                that.getGeoDocument(id, callback);
                break;
            case docVars.enums.ObjectTypes.PPP: // "ППП"
                that.getFutureUsabilityGeoDocument(id, callback);
                break;
            default:
                callback(null);
                break;
        }
    },
    getSubsurface: function (id, callback) {
        var that = this;
        var url = globalVars.consts.AbsoluteUri + "/api/subsurface/get_subsurface/" + id;
        var oldLinkIdentifier = "OLD_LINK_DETECTED";

        $.ajax({
            url: url,
            dataType: "json",
            type: "GET",
            success: function (result) {
                if (result == oldLinkIdentifier) {
                    that.showError('Данные участка недр устарели');
                } else if (result) {
                    callback({
                        Auction: null,
                        Document: null,
                        Id: 0,
                        License: null,
                        Organization: null,
                        Subsurface: result
                    });
                } else {
                    that.showError(that.get('errorMessage'));
                }
            },
            error: function (error) {
                that.showError(that.get('errorMessage'));
                console.error(result);
            }
        });
    },
    getLicenseInfo: function (id, callback) {
        var that = this;
        var url = globalVars.consts.AbsoluteUri + "/api/license/get_license/" + id;
        var oldLinkIdentifier = "OLD_LINK_DETECTED";

        $.ajax({
            url: url,
            dataType: "json",
            type: "GET",
            success: function (result) {
                if (result == oldLinkIdentifier) {
                    that.showError('Данные лицензии устарели');
                } else if (result) {
                    result.Id = id;
                    callback({
                        Auction: null,
                        Document: null,
                        Id: 0,
                        License: result,
                        Organization: null,
                        Subsurface: null
                    });
                } else {
                    that.showError(that.get('errorMessage'));
                }
            },
            error: function (error) {
                that.showError(that.get('errorMessage'));
                console.error(result);
            }
        });
    },
    getOrganizationInfo: function (id, callback) {
        var that = this;
        var url = globalVars.consts.AbsoluteUri + "/api/organization/get_organization/" + id;
        var oldLinkIdentifier = "OLD_LINK_DETECTED";

        $.ajax({
            url: url,
            dataType: "json",
            type: "GET",
            success: function (result) {
                if (result == oldLinkIdentifier) {
                    that.showError('Данные юридического лица устарели');
                } else if (result) {
                    callback({
                        Auction: null,
                        Document: null,
                        Id: 0,
                        License: null,
                        Organization: result,
                        Subsurface: null
                    });
                } else {
                    that.showError(that.get('errorMessage'));
                }
            },
            error: function (error) {
                that.showError(that.get('errorMessage'));
                console.error(result);
            }
        });
    },
    getAuctionInfo: function (id, callback) {
        var that = this;
        var url = globalVars.consts.AbsoluteUri + "/api/auction/get_auction/" + id;
        var oldLinkIdentifier = "OLD_LINK_DETECTED";

        $.ajax({
            url: url,
            dataType: "json",
            type: "GET",
            success: function (result) {
                if (result == oldLinkIdentifier) {
                    that.showError('Данные торгов устарели');
                } else if (result) {
                    console.log(result)
                    callback({
                        Auction: result,
                        Document: null,
                        Id: 0,
                        License: null,
                        Organization: null,
                        Subsurface: null
                    });
                } else {
                    that.showError(that.get('errorMessage'));
                }
            },
            error: function (error) {
                that.showError(that.get('errorMessage'));
                console.error(result);
            }
        });
    },
    getGeoDocument: function (id, callback) {
        var that = this;
        var url = globalVars.consts.AbsoluteUri + "/api/document/get_document/" + id;
        var oldLinkIdentifier = "OLD_LINK_DETECTED";

        $.ajax({
            url: url,
            dataType: "json",
            type: "GET",
            success: function (result) {
                if (result == oldLinkIdentifier) {
                    that.showError('Данные документа устарели');
                } else if (result) {
                    callback({
                        Auction: null,
                        Document: result,
                        Id: 0,
                        License: null,
                        Organization: null,
                        Subsurface: null
                    });
                } else {
                    that.showError(that.get('errorMessage'));
                }
            },
            error: function (error) {
                that.showError(that.get('errorMessage'));
                console.error(result);
            }
        });
    },
    getFutureUsabilityGeoDocument: function (id, callback) {
        var that = this;
        var url = globalVars.consts.AbsoluteUri + "/api/future_usability/get?id=" + id;
        var oldLinkIdentifier = "OLD_LINK_DETECTED";

        $.ajax({
            url: url,
            dataType: "json",
            type: "GET",
            success: function (result) {
                if (result == oldLinkIdentifier) {
                    that.showDocError('Данные документа устарели');
                } else if (result) {
                    callback({
                        Auction: null,
                        Document: null,
                        Id: 0,
                        License: null,
                        Organization: null,
                        Subsurface: null,
                        FutureUsability: result
                    });
                } else {
                    that.showDocError(that.get('errorMessage'));
                }
            },
            error: function (error) {
                that.showDocError(that.get('errorMessage'));
                console.error(result);
            }
        });
    },
    getDocument: function (id, callback) {
        var that = this;
        var url = globalVars.consts.AbsoluteUri + "/api/document/get_document/" + id;
        var oldLinkIdentifier = "OLD_LINK_DETECTED";

        $.ajax({
            url: url,
            dataType: "json",
            type: "GET",
            success: function (result) {
                if (result == oldLinkIdentifier) {
                    that.showDocError('Данные документа устарели');
                } else if (result) {
                    callback(result);
                } else {
                    that.showDocError(that.get('errorMessage'));
                }
            },
            error: function (error) {
                that.showDocError(that.get('errorMessage'));
                console.error(result);
            }
        });
    },

    // datasources 
    documentTypesDropDataSource: new kendo.data.DataSource({
        transport: {
            read: {
                url: globalVars.consts.AbsoluteUri + "/api/document/get_types",
                dataType: "json",
                type: "GET"
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
        }
    }),
    objectTypes: new kendo.data.DataSource({
        data: [
            { text: "Участок недр", value: docVars.enums.ObjectTypes.Subsurface },
            { text: "Лицензия", value: docVars.enums.ObjectTypes.License },
            { text: "Недропользователь", value: docVars.enums.ObjectTypes.Organization },
            { text: "Торги", value: docVars.enums.ObjectTypes.Auction },
            { text: "Документ", value: docVars.enums.ObjectTypes.Document },
            { text: "ППП", value: docVars.enums.ObjectTypes.PPP }
        ],
        schema: {
            errors: function (response) {
                return response.Error;
            }
        },
        error: function (error) {
            console.log(error.responseJSON);
        }
    }),
};

$(document).ready(function () {
    kendo.culture("ru-RU");

    window.editVM = kendo.observable(editVM);
    kendo.bind($("#edit-form"), window.editVM);

    window.editVM.init();
});
