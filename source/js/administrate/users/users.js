var usersVM = {
    init: function () {
        $("#users-grid").kendoGrid({
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        $.ajax({
                            url: globalVars.consts.AbsoluteUri + "/Admin/Users/GetUsers",
                            dataType: "json",
                            data: {
                                skip: (options.data.page - 1) * options.data.pageSize,
                                take: options.data.pageSize
                            },
                            type: "GET",
                            success: function (result) {
                                options.success(result);
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
                            RoleId:{
                                type: "number"
                            }
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
                    field: "Surname",
                    title: "Пользователь",
                    template: "<span>#: Surname # #: Name # #: MiddleName #</span>"
                },
                {
                    field: "Email",
                    title: "E-mail"
                },
                {
                    field: "RoleName",
                    title: "Роль",
                    template: "# if (!!Role) { # <span>#: Role.Name #</span> # } #"
                },
                {
                    field: "Status",
                    title: "Статус",
                    template: "# if (!IsApproved) { # <span>Не подтвержден</span> # }  else if(LastConnectionDateTime) { # <span>#: moment(LastConnectionDateTime).format('DD.MM.YYYY HH:mm') #</span> # } #"
                },
                {
                    command: [
                            {
                                name: 'ChangeAdmin',
                                text: '<i class="fa fa-user-plus"></i>',
                                click: function (e) {
                                    var tr = $(e.target).closest("tr");
                                    var data = this.dataItem(tr);
                                    $.ajax({
                                        url: globalVars.consts.AbsoluteUri + "/Admin/Users/AssignRoleToUser",
                                        dataType: "json",
                                        data: {
                                            UserId: data.Id,
                                            RoleId: 2
                                        },
                                        type: "GET",
                                        success: function (result) {
                                            $("#users-grid").data("kendoGrid").dataSource.read();
                                        },
                                        error: function (error, textStatus) {
                                            console.log(error);
                                        }

                                    });
                                    return false;
                                },
                            }
                    ],
                    title: "",
                    width: 45
                },
                {
                    command: [
                            {
                                name: 'ChangeUser',
                                text: '<i class="fa fa-user"></i>',
                                click: function (e) {
                                    var tr = $(e.target).closest("tr");
                                    var data = this.dataItem(tr);
                                    $.ajax({
                                        url: globalVars.consts.AbsoluteUri + "/Admin/Users/AssignRoleToUser",
                                        dataType: "json",
                                        data: {
                                            UserId: data.Id,
                                            RoleId: 1
                                        },
                                        type: "GET",
                                        success: function (result) {
                                            $("#users-grid").data("kendoGrid").dataSource.read();
                                        },
                                        error: function (error, textStatus) {
                                            console.log(error);
                                        }

                                    });
                                    return false;
                                },
                            }
                    ],
                    title: "",
                    width: 43
                },
                {
                    command: [
                            {
                                name: 'Delete',
                                text: '<i class="fa fa-times"></i>',
                                click: function (e) {
                                    var tr = $(e.target).closest("tr");
                                    var data = this.dataItem(tr);
                                    $.ajax({
                                        url: globalVars.consts.AbsoluteUri + "/Admin/Users/DeleteUser",
                                        dataType: "json",
                                        data: {
                                            id: data.Id
                                        },
                                        type: "GET",
                                        success: function (result) {
                                            $("#users-grid").data("kendoGrid").dataSource.read();
                                        },
                                        error: function (error, textStatus) {
                                            console.log(error);
                                        }

                                    });
                                    return false;
                                },
                            }
                    ],
                    title: "",
                    width: 43
                },
                {
                    command: [
                            {
                                name: 'Checked',
                                text: '<i class="fa fa-check"></i>',
                                click: function (e) {
                                    var tr = $(e.target).closest("tr");
                                    var data = this.dataItem(tr);
                                    $.ajax({
                                        url: globalVars.consts.AbsoluteUri + "/Admin/Users/ApproveUser",
                                        dataType: "json",
                                        data: {
                                            id: data.Id
                                        },
                                        type: "GET",
                                        success: function (result) {
                                            $("#users-grid").data("kendoGrid").dataSource.read();
                                        },
                                        error: function (error, textStatus) {
                                            console.log(error);
                                        }

                                    });
                                    return false;
                                },
                            }
                    ],
                    title: "",
                    width: 43
                }
            ],
            resizable: false,
            //reorderable: true,
            editable: false,
            pageSize: 15,
            pageable: true,
            sortable: false,
            dataBound: function () {
                var grid = this;

                grid.tbody.find("tr[role='row']").each(function () {
                    var model = grid.dataItem(this);

                    if (!!model.Role && model.Role.Id == 1) {
                        $(this).find(".k-grid-ChangeAdmin").show();
                        $(this).find(".k-grid-ChangeUser").hide();
                    } else {
                        $(this).find(".k-grid-ChangeAdmin").hide();
                        $(this).find(".k-grid-ChangeUser").show();
                    }

                    if (model.IsApproved) {
                        $(this).find(".k-grid-Checked").hide();
                    } else {
                        $(this).find(".k-grid-Checked").show();
                    }
                });
            }
        });
    }
}

$(document).ready(function () {
    window.usersVM = kendo.observable(usersVM);
    kendo.bind($("#edit-form"), window.usersVM);

    window.usersVM.init();
});