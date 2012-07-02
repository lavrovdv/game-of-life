/**
 * User: Dmitry Lavrov
 * Date: 24.06.12
 * Time: 18:45
 */

var MATRIX  = new Array();
var MATRIX_T  = new Array();
var TIMER  = null;

$(document).ready(function () {
    var cell_width  = 23;
    var cell_height = 23;

    var container   = $('#container');
    var cell_html   = '<div class="cell" id="$x|$y"></div>';
    var row_html    = '<div class="row">$</div>';
    var field       = calculate_field(container, cell_width, cell_height);
    $('#container').html(print_table(field[0], field[1], cell_html, row_html));

    $('.cell').click(function(){
        var x = parseInt($(this).attr('id').split('|')[0]);
        var y = parseInt($(this).attr('id').split('|')[1]);
        document.getElementById(x + '|' + y).style.backgroundColor = 'rgba(0, 0, 0, 0.10)';
        MATRIX[x][y] = 1;
    });

    $('#start-stop').toggle(
        function(){
            TIMER = setInterval(function(){live(MATRIX);}, 1);
            $(this).text('Stop');
        },
        function(){
            clearInterval(TIMER);
            $(this).text('Start');
        }
    );

    $('#random').click(
        function(){
        random();
        draw();
    });

});

function calculate_field(container, cell_width, cell_height){
    var container_width = container.width();
    var container_height = container.height();
    var cell_count = Math.ceil(container_width / cell_width) - 15;
    var rows_count = Math.ceil(container_height / cell_height) - 10;

    for (var i = 0; i < rows_count; i++) {
        MATRIX.push([]);
        MATRIX_T.push([]);
        for (var j = 0; j < cell_count; j++) {
            MATRIX[i].push(0);
            MATRIX_T[i].push(0);
        }
    }
    return [rows_count, cell_count]
}

function random(){
    for (var i = 0; i < MATRIX.length; i++) {
        for (var j = 0; j < MATRIX[i].length; j++) {
            MATRIX[i][j] = Math.round(Math.random(0,1));
        }
    }
}

function draw(){
    for (var i = 0; i < MATRIX.length; i++) {
        for (var j = 0; j < MATRIX[i].length; j++) {
            document.getElementById(i + '|' + j).style.backgroundColor = MATRIX[i][j] === 1 ? 'rgba(0, 0, 0, 0.07)' : 'rgba(0, 0, 0, 0.0)';
        }
    }
}

function print_table(rows_count, cell_count, cell_html, row_html){
    var result = '';
    var replace_symbol = '$';

    for (var row = 0; row < rows_count; row++) {
        var row_string = '';
        for (var cell = 0; cell < cell_count; cell++) {
            row_string += cell_html.replace(replace_symbol + 'x', row.toString()).replace(replace_symbol + 'y', cell.toString());
        }
        result += row_html.replace(replace_symbol, row_string)
    }
    return result;
}

function live(area){
    var x_size = MATRIX.length - 1;
    var y_size = MATRIX[0].length - 1;
    var weight, s1, s2, s3, s4, s5, s6, s7, s8, x_inc, x_dec, y_inc, y_dec;

    for (var x = 0; x < MATRIX.length; x++) {
        for (var y = 0; y < MATRIX[x].length; y++) {

            x_inc = x + 1 > x_size ? 0 : x + 1;
            x_dec = x - 1 < 0 ? x_size : x - 1;
            y_inc = y + 1 > y_size ? 0 : y + 1;
            y_dec = y - 1 < 0 ? y_size : y - 1;

            s1 = MATRIX[x][y_dec];
            s2 = MATRIX[x_inc][y_dec];
            s3 = MATRIX[x_inc][y];
            s4 = MATRIX[x_inc][y_inc];
            s5 = MATRIX[x][y_inc];
            s6 = MATRIX[x_dec][y_inc];
            s7 = MATRIX[x_dec][y];
            s8 = MATRIX[x_dec][y_dec];

            weight = s1 + s2 + s3 + s4 + s5 + s6 + s7 + s8;

            MATRIX_T[x][y] = 0;
            if (MATRIX[x][y] == 0 && weight == 3){
                MATRIX_T[x][y] = 1
            }

            if (MATRIX[x][y] == 1 && (weight == 2 || weight == 3)){
                MATRIX_T[x][y] = 1
            }

            if (MATRIX[x][y] == 1 && (weight < 2 || weight > 3)){
                MATRIX_T[x][y] = 0
            }
            document.getElementById(x + '|' + y).style.backgroundColor = MATRIX_T[x][y] === 1 ? 'rgba(0, 0, 0, 0.07)' : 'rgba(0, 0, 0, 0.0)';
        }
    }

    for (var i = 0; i < MATRIX.length; i++) {
        for (var j = 0; j < MATRIX[i].length; j++) {
            MATRIX[i][j] = MATRIX_T[i][j];
        }
    }
}
