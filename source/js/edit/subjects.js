var subjectsVM = {
    selectedSubjectsCount: 0,
    allSubjects: [],
    subjects: [],
    selectedSubjectId: 0,
    selectedSubjectName: "",
    selectedGroupSubjects: null,

    init: function () {
        var that = this;
        $.ajax({
            url: globalVars.consts.AbsoluteUri + "/api/subsurface/get_subjects",
            dataType: "json",
            type: "GET",
            success: function (result) {
                var firsted = [110],
                    items = [];
                $.each(result, function (k, v) {
                    if (firsted.includes(v.Id))
                        items.push($.extend({ isOtherCountries: true }, v));
                    else
                        items.push($.extend({ isOtherCountries : false }, v));
                });
                that.set('allSubjects', items);
                that.updateAllSubjects();
            }
        });
    },
    //Events
    updateAllSubjects: function () {
        var subjects = this.get('allSubjects');
        var result = [];
        $.each(subjects, function (k, v) {
            if (!v.ParentId) {
                var item = v;
                item.Child = [];
                result.push(item);
            }
        });
        $.each(subjects, function (k, v) {
            if (!!v.ParentId) {
                $.each(result, function (k1, v1) {
                    if (v.ParentId == v1.Id) {
                        result[k1].Child.push(v);
                    }
                });
            }
        });

        this.set('allSubjects', result);
        this.updateSubjects();
    },
    updateSubjects: function (searchText) {
        var subjects = this.get('allSubjects');
        var result = [];

        for (var i = 0; i < subjects.length; i++) {
            var item = subjects[i];

            $.each(item.Child, function (k, v) {
                item.Child[k].Filtered = false;
                if (!!$("#subject-" + v.ParentId + "-" + v.Id))
                    item.Child[k].Checked = $("#subject-" + v.ParentId + "-" + v.Id).prop("checked");
                if (!!searchText) {
                    if (!v.Name.toLowerCase().includes(searchText.toLowerCase()))
                        item.Child[k].Filtered = true;
                }
            });
            var total = 0;
            $.each(item.Child, function (k, v) {
                if (!v.Filtered)
                    total = total + 1;
            });
            if (item.Child.length > 0) {
                subjects[i].Total = total;
                var minItemsShow = 4;
                if (minItemsShow >= total) {
                    subjects[i].Total = total;
                    subjects[i].ShowMore = false;
                } else {
                    var itemsShow = 6;
                    if (total > itemsShow) {
                        var min = minItemsShow;
                        var max = itemsShow;
                        var random = Math.ceil(Math.random() * (max - min) + min);
                        subjects[i].ItemsShowCount = random;
                        subjects[i].ShowMore = random != subjects[i].Total;
                    } else {
                        subjects[i].ItemsShowCount = subjects[i].Total;
                        subjects[i].ShowMore = false;
                    }
                }
                var showedItems = 0;
                $.each(item.Child, function (k, v) {
                    if (showedItems > subjects[i].ItemsShowCount || v.Filtered) {
                        //console.log(subjects[i], k, "visible");
                        subjects[i].Child[k].Visible = false;
                    }
                    else {
                        subjects[i].Child[k].Visible = true;
                        showedItems++;
                    }
                });
                subjects[i].Visible = total > 0;
                var allChecked = true;
                $.each(item.Child, function (k, v) {
                    if (!v.Filtered && !v.Checked) {
                        allChecked = false;
                    }
                });
                subjects[i].Checked = allChecked;
                result.push(subjects[i]);
            }
        }

        this.set('subjects', result);

        $.each(result, function (k, v) {
            if (!!v.Checked) {
                $("#subject-" + v.Id).prop("checked", v.Checked);
            }
            $.each(v.Child, function (k1, v1) {
                if (!!v1.Checked) {
                    $("#subject-" + v1.ParentId + "-" + v1.Id).prop("checked", v1.Checked);
                }
            });
        });
    },
    searchTextSubjectOnKeyUp: function (e) {
        this.updateSubjects($(e.target).val());
    },
    updateSelectedSubjectsCount: function () {
        this.set('selectedSubjectsCount', $(".subject_group_value:checked").length);
    },
    getVisibleOtherLine: function () {
        var subjects = this.get('subjects');
        return subjects.filter(function (elem) {
            return !!elem.isOtherCountries && elem.Child.filter(function (child) { return !!child.Visible }).length;
        }).length && subjects.filter(function (elem) {
            return !elem.isOtherCountries && elem.Child.filter(function (child) { return !!child.Visible }).length;
        }).length;
    },
    getGroupSubjectsByCol: function (col, isOtherCountries) {
        if (typeof (isOtherCountries) == 'undefined')
            isOtherCountries = false;
        var subjects = this.get('subjects').filter(function (elem) {
            return (isOtherCountries && !!elem.isOtherCountries) || (!isOtherCountries && !elem.isOtherCountries)
                && elem.Child.filter(function (child) { return !!child.Visible }).length;
        });
        var result = [];
        for (var i = col; i < subjects.length; i = i + 3) {
            result.push(subjects[i]);
        }
        return result;
    },
    getSubjectsCol1: function () {
        return this.getGroupSubjectsByCol(0, false);
    },
    getSubjectsCol2: function () {
        return this.getGroupSubjectsByCol(1, false);
    },
    getSubjectsCol3: function () {
        return this.getGroupSubjectsByCol(2, false);
    },
    getSubjectsOtherCountriesCol1: function(){
        return this.getGroupSubjectsByCol(0, true);
    },
    getSubjectsOtherCountriesCol2: function () {
        return this.getGroupSubjectsByCol(1, true);
    },
    getSubjectsOtherCountriesCol3: function () {
        return this.getGroupSubjectsByCol(2, true);
    },
    clearSearchTextSubject: function () {
        $("#searchTextSubject").val("");
        this.updateSubjects();
    },
    clearAllSubjects: function () {
        $(".subject_all, .subject").prop("checked", false);
        if (!!$("#searchTextSubject").val())
            this.updateSubjects();
        $("#searchTextSubject").val("");
        this.set('selectedSubjectsCount', 0);
    },
    subjectChange: function (e) {
        var subjectGroupId = $(e.target).val();
        var selectedGroupIsAll = this.get("selectedSubjectId") == subjectGroupId;
        var subjects = this.get("subjects");

        $.each(subjects, function (k, v) {
            if (subjectGroupId == v.Id) {
                $.each(v.Child, function (k1, v1) {
                    if (!v1.Filtered) {
                        $("#subject-" + v1.ParentId + "-" + v1.Id).prop("checked", $(e.target).prop("checked"));
                        if (selectedGroupIsAll) {
                            $("#subject-" + v1.ParentId + "-" + v1.Id + "-all").prop("checked", $(e.target).prop("checked"));
                        }
                    }
                });
            }
        });

        //$(e.target).closest("li").find(".subject").prop("checked", $(e.target).prop("checked"));
        if (selectedGroupIsAll) {
            //$(".subject_all").prop("checked", $(e.target).prop("checked"));
            $("#" + $(e.target).attr("id") + "-all").prop("checked", $(e.target).prop("checked"));
        }
        this.updateSelectedSubjectsCount();
    },
    subjectChildChange: function (e) {
        var subjectGroupId = $(e.target).closest(".subject_group").find(".subject_group_header").first().val();
        var subjects = this.get("subjects");

        var allSelected = true;
        $.each(subjects, function (k, v) {
            if (subjectGroupId == v.Id) {
                $.each(v.Child, function (k1, v1) {
                    if (!v1.Filtered && !$("#subject-" + v1.ParentId + "-" + v1.Id).prop("checked")) {
                        allSelected = false;
                    }
                });
            }
        });

        $(e.target).closest(".subject_group").find(".subject_group_header").prop("checked", allSelected);
        $("#" + this.getIdForSubjectGroupAll()).prop("checked", allSelected);

        $("#" + $(e.target).attr("id") + "-all").prop("checked", $(e.target).prop("checked"));
        this.updateSelectedSubjectsCount();
    },
    showAllSubjects: function (e) {
        $(e.target).blur();
        this.set('selectedGroupSubjects', e.data);
        this.set('selectedSubjectName', e.data.Name);
        this.set('selectedSubjectId', e.data.Id);
        $('.hidden-coll').removeClass('hidden');
    },
    getCheckedInAllSubjects: function (e) {
        return $("#subject-" + e.ParentId + "-" + e.Id).prop("checked");
    },
    getCheckedGroupInAllSubjects: function () {
        return $("#subject-" + this.get('selectedSubjectId')).prop("checked");
    },
    getIdForSubjectGroupAll: function () {
        return this.getIdForSubjectGroup() + "-all";
    },
    getIdForSubjectGroup: function () {
        return 'subject-' + this.get('selectedSubjectId');
    },
    getSubjectsByCol: function (col) {
        var selectedGroup = this.get('selectedGroupSubjects');
        if (!selectedGroup)
            return [];

        var filteredItems = [];
        var result = [];
        $.each(selectedGroup.Child, function (k, v) {
            if (!v.Filtered) {
                filteredItems.push(v);
            }
        });
        for (var i = col; i < filteredItems.length; i = i + 3) {
            result.push(filteredItems[i]);
        }
        return result;
    },
    getSelectedSubjectsCol1: function () {
        var selectedGroup = this.get('selectedGroupSubjects');
        if (!!selectedGroup) {
            return this.getSubjectsByCol(0);
        }
        return [];
    },
    getSelectedSubjectsCol2: function () {
        var selectedGroup = this.get('selectedGroupSubjects');
        if (!!selectedGroup) {
            return this.getSubjectsByCol(1);
        }
        return [];
    },
    getSelectedSubjectsCol3: function () {
        var selectedGroup = this.get('selectedGroupSubjects');
        if (!!selectedGroup) {
            return this.getSubjectsByCol(2);
        }
        return [];
    },
    hideAllSubjects: function (e) {
        $(e.target).blur();
        $('.hidden-coll').addClass('hidden');
    },
}

$(document).ready(function () {
    window.subjectsVM = kendo.observable(subjectsVM);
    kendo.bind($("#subjects-list"), window.subjectsVM);

    window.subjectsVM.init();
    $(window).trigger('resize');
});