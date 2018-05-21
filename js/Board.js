var board = {
    name: 'Tablica Kanban',
    createColumn: function(column) {
        this.element.append(column.element);
        this.colums.push(column)
        initSortable();
    },
    element: $('#board .column-container'),
    colums: []
};

$('.create-column')
    .click(function() {
        var columnName = prompt('Enter a column name');
        $.ajax({
            url: baseUrl + '/column',
            method: 'POST',
            data: {
                name: columnName
            },
            success: function(response) {
                var column = new Column(response.id, columnName);
                board.createColumn(column);
            }
        });
    });

function getAllCards() {
    var result = []

    board.colums.forEach(col => {
        result.push(...col.cards)
    })

    return result
}

function initSortable() {
    $('.card-list').sortable({
        connectWith: '.card-list',
        placeholder: 'card-placeholder',
        stop: function(event, ui) {
            var card_id = parseInt($(ui.item).first().attr('data-id')),
                name = getAllCards().find(el => el.id === card_id).name
            	bootcamp_kanban_column_id = $(ui.item).first().closest('.column').attr('data-id');

            $.ajax({
                url: baseUrl + '/card/' + card_id,
                method: 'PUT',
                data: {
                    card_id,
                    name,
                    bootcamp_kanban_column_id
                }
            });
        }
    }).disableSelection();
}