function click() {
    // Save it using the Chrome extension storage API.
    chrome.storage.sync.set({ 'value': theValue }, function () {
        // Notify that we saved.
        message('Settings saved');
    });
	getCurrentTabUrl(function(tab){
		chrome.tabs.update(tab.id, {url: "http://dev.unify.icas.com/?usr=" + $("#user").val() + "&pwd=axnx4r4bfw"});
	});
}

function addList() {
    // Get the list
    chrome.storage.sync.get("lists", function (items) {
        var theList = items.lists;
        if (theList == undefined) {
            theList = [];
        }
        theList.push($("#newList").val());
        var json = {};
        json["lists"] = theList;
        // Save it using the Chrome extension storage API.
        chrome.storage.sync.set(json, function () {
            refreshLists();
            $("#newList").val("");
        });
    });
}

function addItem() {
    // Get the list
    chrome.storage.sync.get("todos", function (items) {
        var theList = items.todos;
        if (theList == undefined) {
            theList = [];
        }
        theList.push({ txt: $("#newItem").val(), lst: $("#ddLists").val() });
        var json = {};
        json["todos"] = theList;
        // Save it using the Chrome extension storage API.
        chrome.storage.sync.set(json, function () {
            refresh();
            $("#newItem").val("");
        });
    });
}

function removeItem(id) {
    // Get the list
    chrome.storage.sync.get("todos", function (items) {
        var theList = items.todos;
        theList.splice(id);
        var json = {};
        json["todos"] = theList;
        // Save it using the Chrome extension storage API.
        chrome.storage.sync.set(json, function () {
            refresh();
        });
    });
}

function refreshLists() {
    // Get the list
    var select = document.getElementById("ddLists");
    for (i = 0; i <  select.options.length; i++) {
        select.options[i] = null;
    }

    chrome.storage.sync.get("lists", function (items) {

        if (items.lists != undefined) {
            for (var i = 0; i < items.lists.length; i++) {
                var option = document.createElement('option');
                option.value = option.text = items.lists[i];
                select.add(option);
            }
        }
    });
}

function refresh() {
    // Get the list
    document.getElementById("list").innerHTML = "";
    chrome.storage.sync.get("todos", function (items) {
        if (items.todos == undefined) {
            html = "No Items - Add some below";
            return;
        }
        var html = '<table class="tbl_items">'
        for (var i = 0; i < items.todos.length; i++) {
            if (items.todos[i].lst == $("#ddLists").val()) {
                html += '<tr><td style="width:75%"><div class="todo_item">' + items.todos[i].txt + '</div></td><td style="width:25%"><span id="' + i + '" class="btn todo_delete">X</span></td></tr>';
            }
        }
        html += '</table>';
        document.getElementById("list").innerHTML += html;

        $(".todo_delete").click(function () {
            removeItem($(this).attr('id'));
        })
    });
}

document.addEventListener('DOMContentLoaded', function () {
    refreshLists();
    refresh();
    $("#btnNewItem").click(function () {
        addItem();
    });

    $("#btnNewList").click(function () {
        addList();
    });

    $("#newItem").keypress(function (event) {
        if (event.which == 13) {
            addItem();
            event.preventDefault();
        }
    });

    $("#newList").keypress(function (event) {
        if (event.which == 13) {
            addList();
            event.preventDefault();
        }
    });

    $("#ddLists").change(function () {
        refresh();
    });
});