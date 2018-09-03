var mineralsVM = {
    minerals: [],
    allMinerals: [],
    selectedGroupMinerals: null,
    selectedGroupName: "",
    selectedGroupId: 0,
    selectedMineralsCount: 0,
    isOreStock: false,
    checkChildElements: true,

    //Viisble
    getVisibleChildItemsInPopular: function (data) {
        var result = false;
        if (!!data) {
            if (data.Popular && data.Visible && !!data.ChildMinerals && data.ChildMinerals.length > 0) {
                $.each(data.ChildMinerals, function (k, v) {
                    if (v.Popular)
                        result = true;
                });
            }
        }
        return result;
    },
    getVisibleChildInPopular: function (data) {
        return (!!data && data.Popular);
    },

    init: function () {
        var that = this;
        $.ajax({
            url: globalVars.consts.AbsoluteUri + "/api/subsurface/get_minerals",
            dataType: "json",
            type: "GET",
            success: function (result) {
                that.set('allMinerals', result);
                that.updateMinerals();
            }
        });
    },
    //EVENTS
    updateMinerals: function (searchText) {
        var minerals = this.get('allMinerals');
        var result = [];
        for (var i = 0; i < minerals.Groups.length; i++) {
            var item = minerals.Groups[i];
            var groupVisible = false;

            var newItem = {
                Id: item.Id,
                Name: item.Name,
                Minerals: []
            }

            if (!!searchText && !!item.Name) {
                if (item.Name.toLowerCase().indexOf(searchText.toLowerCase()) > -1)
                    groupVisible = true;
            }

            var childMinerals = [];

            $.each(minerals.Items, function (k, v) {
                v.Filtered = false;
                v.ChildMinerals = [];
                if (!!$("#mineral-" + v.GroupId + "-" + v.Id))
                    v.Checked = $("#mineral-" + v.GroupId + "-" + v.Id).prop("checked");
                if (!!searchText && !!v.Name) {
                    if (v.Name.toLowerCase().indexOf(searchText.toLowerCase()) == -1)
                        v.Filtered = true;
                }

                if (groupVisible)
                    v.Filtered = false;

                if (!!v.ParentId) {
                    childMinerals.push($.extend({}, v));
                }
                else if (v.GroupId == item.Id)
                    newItem.Minerals.push($.extend({}, v));
            });
            
            $.each(newItem.Minerals, function (k, v) {
                $.each(childMinerals, function (k1, v1) {
                    if (v1.ParentId == v.Id) {
                        v1.Visible = !v1.Filtered;
                        newItem.Minerals[k].ChildMinerals.push($.extend({}, v1));
                        if (!v1.Filtered)
                            newItem.Minerals[k].Filtered = false;
                    }
                });
            });

            var total = 0;
            var totalPopular = 0;
            $.each(newItem.Minerals, function (k, v) {
                if (!v.Filtered)
                    total = total + 1;
                $.each(v.ChildMinerals, function (k1, v1) {
                    if (!v1.Filtered)
                        total = total + 1;
                });
                if (v.Popular)
                    totalPopular = totalPopular + 1;
            });
            if (newItem.Minerals.length > 0) {
                newItem.Total = total;
                var minItemsShow = 5;
                newItem.ItemsShowCount = totalPopular;
                if (newItem.ItemsShowCount == newItem.Total) {
                    newItem.ShowMore = false;
                } else {
                    newItem.ShowMore = true;
                    /*var itemsShow = 10;
                    if (newItem.Total > itemsShow) {
                        var min = minItemsShow;
                        var max = itemsShow;
                        var random = Math.ceil(Math.random() * (max - min) + min);
                        newItem.ItemsShowCount = random;
                    } else {
                        newItem.ItemsShowCount = newItem.Total;
                    }*/
                }
                var showedItems = 0;
                $.each(newItem.Minerals, function (k, v) {
                    if (showedItems > newItem.ItemsShowCount || v.Filtered || !v.Popular)
                        newItem.Minerals[k].Visible = false;
                    else {
                        newItem.Minerals[k].Visible = true;
                        showedItems++;
                    }
                });
                newItem.ShowMore = showedItems != newItem.Total;
                newItem.Visible = total > 0;
                var allChecked = true;
                var allFiltered = true;
                $.each(newItem.Minerals, function (k, v) {
                    if (!v.Filtered && !v.Checked) {
                        allChecked = false;
                    }
                    if (!v.Filtered)
                        allFiltered = false;
                });
                newItem.Checked = allChecked && !allFiltered;
                result.push(newItem);
                
            }
        }
        this.set('minerals', result);

        $.each(result, function (k, v) {
            if (!!v.Checked) {
                $("#mineral-" + v.Id).prop("checked", v.Checked);
            }
            $.each(v.Minerals, function (k1, v1) {
                if (!!v1.Checked) {
                    $("#mineral-" + v1.GroupId + "-" + v1.Id).prop("checked", v1.Checked);
                }
            });
        });
    },
    mineralGroupChange: function (e) {
        if (this.get('isOreStock')) {
            $(e.target).prop("checked", false);
            return false;
        }
        var mineralGroupId = $(e.target).val();
        var selectedGroupIsAll = this.get("selectedGroupId") == mineralGroupId;
        var minerals = this.get("minerals");

        $.each(minerals, function (k, v) {
            if (mineralGroupId == v.Id) {
                $.each(v.Minerals, function (k1, v1) {
                    if (!v1.Filtered) {
                        $("#mineral-" + v1.GroupId + "-" + v1.Id).prop("checked", $(e.target).prop("checked"));
                        if (selectedGroupIsAll) {
                            $("#mineral-" + v1.GroupId + "-" + v1.Id + "-all").prop("checked", $(e.target).prop("checked"));
                        }
                    }
                    $.each(v1.ChildMinerals, function (i, c) {
                        if (!v1.Filtered) {
                            $("#mineral-" + c.GroupId + "-" + c.Id).prop("checked", $(e.target).prop("checked"));
                            $("#mineral-" + c.GroupId + "-" + c.Id + "-all").prop("checked", $(e.target).prop("checked"));
                        }
                    })
                });
            }
        });

        //$(e.target).closest("li").find(".mineral_group_value").prop("checked", $(e.target).prop("checked"));
        if (selectedGroupIsAll) {
            //$(".mineral_all").prop("checked", $(e.target).prop("checked"));
            $("#" + $(e.target).attr("id") + "-all").prop("checked", $(e.target).prop("checked"));
        }
        this.updateSelectedMineralsCount();
    },
    mineralChildChange: function (e) {
        if (this.get('isOreStock') && $(e.target).prop("checked")) {
            $(".mineral").prop("checked", false);
            $(e.target).prop("checked", true);
            return false;
        }
        var mineralGroupId = $(e.target).closest(".mineral_group").find(".mineral_group_header").first().val();
        var minerals = this.get("minerals");

        if (this.get('checkChildElements')) {
            if ($(e.target).closest("ul").find("li").length == $(e.target).closest("ul").find("input[type='checkbox']:checked").length) {
                $("#mineral-" + $(e.target).attr("data-parent-id")).prop("checked", true);
                $("#mineral-" + $(e.target).attr("data-parent-id") + "-all").prop("checked", true);
            } else {
                $("#mineral-" + $(e.target).attr("data-parent-id")).prop("checked", false);
                $("#mineral-" + $(e.target).attr("data-parent-id") + "-all").prop("checked", false);
            }

            var allSelected = true;
            $.each(minerals, function (k, v) {
                if (mineralGroupId == v.Id) {
                    $.each(v.Minerals, function (k1, v1) {
                        if (!v1.Filtered && !$("#mineral-" + v1.GroupId + "-" + v1.Id).prop("checked")) {
                            allSelected = false;
                        }
                    });
                }
            });

            $(e.target).closest(".mineral_group").find(".mineral_group_header").prop("checked", allSelected);
            $("#" + this.getIdForMineralGroupAll()).prop("checked", allSelected);
        }

        $("#" + $(e.target).attr("id") + "-all").prop("checked", $(e.target).prop("checked"));
        this.updateSelectedMineralsCount();
    },
    mineralChange: function (e) {
        if (this.get('isOreStock') && $(e.target).prop("checked")) {
            $(".mineral").prop("checked", false);
            $(e.target).prop("checked", true);
            return false;
        }
        var mineralGroupId = $(e.target).closest(".mineral_group").find(".mineral_group_header").first().val();
        var minerals = this.get("minerals");

        var allSelected = true;
        $.each(minerals, function (k, v) {
            if (mineralGroupId == v.Id) {
                $.each(v.Minerals, function (k1, v1) {
                    if (!v1.Filtered && !$("#mineral-" + v1.GroupId + "-" + v1.Id).prop("checked")) {
                        allSelected = false;
                    }
                });
            }
        });

        $(e.target).closest(".mineral_group").find(".mineral_group_header").prop("checked", allSelected);
        $("#" + this.getIdForMineralGroupAll()).prop("checked", allSelected);

        $("#" + $(e.target).attr("id") + "-all").prop("checked", $(e.target).prop("checked"));
        if (this.get('checkChildElements'))
            $.each($(e.target).closest("li").find("ul li input[type='checkbox']"), function (k, v) {
                $(v).prop("checked", $(e.target).prop("checked"));
                $("#" + $(v).attr("id") + "-all").prop("checked", $(e.target).prop("checked"));
            });
        this.updateSelectedMineralsCount();
    },
    getGroupMineralsByCol: function (col) {
        var minerals = this.get('minerals');
        var result = [];
        for (var i = col; i < minerals.length; i = i + 3) {
            result.push(minerals[i]);
        }
        return result;
    },
    getMineralsCol1: function () {
        //return [];
        return this.getGroupMineralsByCol(0);
    },
    getMineralsCol2: function () {
        return this.getGroupMineralsByCol(1);
    },
    getMineralsCol3: function () {
        return this.getGroupMineralsByCol(2);
    },
    getMineralsByCol: function (col) {
        var selectedGroup = this.get('selectedGroupMinerals');
        if (!selectedGroup)
            return [];

        var filteredItems = [];
        var result = [];
        $.each(selectedGroup.Minerals, function (k, v) {
            if (!v.Filtered) {
                filteredItems.push(v);
            }
        });
        for (var i = col; i < filteredItems.length; i = i + 3) {
            result.push(filteredItems[i]);
        }
        return result;
    },
    getSelectedMineralCol1: function () {
        var selectedGroup = this.get('selectedGroupMinerals');
        if (!!selectedGroup) {
            return this.getMineralsByCol(0);
        }
        return [];
    },
    getSelectedMineralCol2: function () {
        var selectedGroup = this.get('selectedGroupMinerals');
        if (!!selectedGroup) {
            return this.getMineralsByCol(1);
        }
        return [];
    },
    getSelectedMineralCol3: function () {
        var selectedGroup = this.get('selectedGroupMinerals');
        if (!!selectedGroup) {
            return this.getMineralsByCol(2);
        }
        return [];
    },
    getIdForMineralGroup: function () {
        return 'mineral-' + this.get('selectedGroupId');
    },
    getIdForMineralGroupAll: function () {
        return this.getIdForMineralGroup() + "-all";
    },
    showAllMinerals: function (e) {
        this.set('selectedGroupMinerals', e.data);
        this.set('selectedGroupName', e.data.Name);
        this.set('selectedGroupId', e.data.Id);
        $(e.target).blur();
        $('.hidden-coll').removeClass('hidden');
    },
    hideAllMinerals: function (e) {
        $(e.target).blur();
        $('.hidden-coll').addClass('hidden');
    },
    hideAllSubjects: function (e) {
        $(e.target).blur();
        $('.hidden-coll').addClass('hidden');
    },
    getCheckedInAllMinerals: function (e) {
        return $("#mineral-" + e.GroupId + "-" + e.Id).prop("checked");
    },
    getCheckedChildInAllMinerals: function (e) {
        return $("#mineral-" + e.GroupId + "-" + e.Id).prop("checked");
    },
    getCheckedGroupInAllMinerals: function (e) {
        return $("#mineral-" + this.get('selectedGroupId')).prop("checked");
    },
    updateSelectedMineralsCount: function () {
        this.set('selectedMineralsCount', $(".mineral_group_value:checked").length);
    },
    clearAllMinerals: function () {
        $(".mineral_all, .mineral").prop("checked", false);
        if (!!$("#searchText").val())
            this.updateMinerals();
        $("#searchText").val("");
        this.set('selectedMineralsCount', 0);
    },
    searchTextOnKeyUp: function (e) {
        this.updateMinerals($(e.target).val());
    },
    clearSearchText: function () {
        $("#searchText").val("");
        this.updateMinerals();
    },
}

$(document).ready(function () {
    window.mineralsVM = kendo.observable(mineralsVM);
    kendo.bind($("#minerals-list"), window.mineralsVM);

    window.mineralsVM.init();
    $(window).trigger('resize');
});