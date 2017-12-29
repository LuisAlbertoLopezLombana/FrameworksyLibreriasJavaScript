/*
 * Control de título Match Game, animación cambio de color.
 * Función colorInicial
 */
function colorInicial() {
  $("h1.main-titulo").animate({
    color: "#DCFF0E"
  }, 0, "", function() {
    setTimeout(function() {
      colorSecundario();
    }, 1000);
  });
}

/*
 * Control de título Match Game, animación cambio de color.
 * Función colorSecundario
 */
function colorSecundario() {
  $("h1.main-titulo").animate({
    color: "#FFFFFF"
  }, 0, "", function() {
    setTimeout(function() {
      colorInicial();
    }, 1000);
  });
}

/**
 * Verificación tablero, busca los hijos asignados deacuerdo a la cantidad de columnas.
 * Inicialmente al estar vacio, pobla el tablero con dulces de manera ramdomica.
 * Identifica los campos vacios y completa con dulces los mismo brindando el efecto gravedad.
 **/
function verificarTablero() {
  var totalDulcesPermitido = 7;
  var div = $(".panel-tablero").find("div");
  $.each(div, function(key, colDulces) {
    var dulcesCant = $(colDulces).children().length;
    var agregarDulces = totalDulcesPermitido - dulcesCant;
    for (var i = 0; i < agregarDulces; i++) {
      var dulceNum = Math.floor((Math.random() * 4) + 1);
      var elementoImgDulce = '<img src="image/' + dulceNum + '.png" class="dulce"></img>';
      if (i === 0 && dulcesCant < 1) {
        $(colDulces).append(elementoImgDulce);
      } else {
        $(colDulces).find('img:eq(0)').before(elementoImgDulce);
      }
      $('.dulce').css({
        width: "90",
        height: "90",
        marginTop: "5px"
      });
    }
  });
  draggDroppDulces('img');
  validaciones();
}

function draggDroppDulces(elemento) {
  $(elemento).draggable({
    containment: '.panel-tablero',
    droppable: 'img',
    revert: true,
    revertDuration: 500,
    grid: [100, 100],
    zIndex: 10,
    drag: limitarDisDulce
  });
  $(elemento).droppable({
    drop: function(event, ui) {
      var dulceMovido = $(ui.draggable);
      var rutaImgDulceMovido = dulceMovido.attr('src');
      var candyDrop = $(this);
      var rutaImgDulceSoltado = candyDrop.attr('src');
      dulceMovido.attr('src', rutaImgDulceSoltado);
      candyDrop.attr('src', rutaImgDulceMovido);

      setTimeout(function() {
        verificarTablero();
        if ($('img.delete').length === 0) {
          dulceMovido.attr('src', rutaImgDulceMovido);
          candyDrop.attr('src', rutaImgDulceSoltado);
        } else {
          $('#movimientos-text').text(Number($('#movimientos-text').text()) + 1);
        }
      }, 200);

    }
  });
  permitirMovimiento();
}

function limitarDisDulce(event, ui) {
  ui.position.top = Math.min(100, ui.position.top);
  ui.position.bottom = Math.min(100, ui.position.bottom);
  ui.position.left = Math.min(100, ui.position.left);
  ui.position.right = Math.min(100, ui.position.right);
}

function arreglosDulces(arrayType, index) {

  var colDulces1 = $('.col-1').children();
  var colDulces2 = $('.col-2').children();
  var colDulces3 = $('.col-3').children();
  var colDulces4 = $('.col-4').children();
  var colDulces5 = $('.col-5').children();
  var colDulces6 = $('.col-6').children();
  var colDulces7 = $('.col-7').children();

  var dulcesColumnas = $([colDulces1, colDulces2, colDulces3, colDulces4,
    colDulces5, colDulces6, colDulces7
  ]);

  if (typeof index === 'number') {
    var candyRow = $([colDulces1.eq(index), colDulces2.eq(index), colDulces3.eq(index),
      colDulces4.eq(index), colDulces5.eq(index), colDulces6.eq(index),
      colDulces7.eq(index)
    ]);

  } else {
    index = '';
  }

  if (arrayType === 'columns') {
    return dulcesColumnas;
  } else if (arrayType === 'rows' && index !== '') {
    return candyRow;
  }
}

// Validacion dulces
function validDulcesColumnas() {
  for (var j = 0; j < 7; j++) {
    var counter = 0;
    var posicionDulce = [];
    var posicionAdicionalDulce = [];
    var columnaDulces = arreglosDulces('columns')[j];
    var comparisonValue = columnaDulces.eq(0);

    var flag = false;
    for (var i = 1; i < columnaDulces.length; i++) {
      var srcComparison = comparisonValue.attr('src');
      var dulceSrc = columnaDulces.eq(i).attr('src');

      if (srcComparison != dulceSrc) {
        if (posicionDulce.length >= 3) {
          flag = true;
        } else {
          posicionDulce = [];
        }
        counter = 0;
      } else {
        if (counter == 0) {
          if (!flag) {
            posicionDulce.push(i - 1);
          } else {
            posicionAdicionalDulce.push(i - 1);
          }
        }
        if (!flag) {
          posicionDulce.push(i);
        } else {
          posicionAdicionalDulce.push(i);
        }
        counter += 1;
      }

      comparisonValue = columnaDulces.eq(i);
    }
    if (posicionAdicionalDulce.length > 2) {
      posicionDulce = $.merge(posicionDulce, posicionAdicionalDulce);
    }
    if (posicionDulce.length <= 2) {
      posicionDulce = [];
    }
    cantidadDulces = posicionDulce.length;
    if (cantidadDulces >= 3) {
      borrarDulces(posicionDulce, columnaDulces, 'columnas');
      actualizarPuntaje(cantidadDulces);
    }
  }
}

function validDulcesFilas() {
  for (var j = 0; j < 7; j++) {
    var counter = 0;
    var posicionDulce = [];
    var posicionAdicionalDulce = [];
    var candyRow = arreglosDulces('rows', j);
    var comparisonValue = candyRow[0];
    var flag = false;
    for (var i = 1; i < candyRow.length; i++) {
      var srcComparison = comparisonValue.attr('src');
      var dulceSrc = candyRow[i].attr('src');

      if (srcComparison != dulceSrc) {
        if (posicionDulce.length >= 3) {
          flag = true;
        } else {
          posicionDulce = [];
        }
        counter = 0;
      } else {
        if (counter == 0) {
          if (!flag) {
            posicionDulce.push(i - 1);
          } else {
            posicionAdicionalDulce.push(i - 1);
          }
        }
        if (!flag) {
          posicionDulce.push(i);
        } else {
          posicionAdicionalDulce.push(i);
        }
        counter += 1;
      }

      comparisonValue = candyRow[i];
    }
    if (posicionAdicionalDulce.length > 2) {
      posicionDulce = $.merge(posicionDulce, posicionAdicionalDulce);
    }
    if (posicionDulce.length <= 2) {
      posicionDulce = [];
    }
    cantidadDulces = posicionDulce.length;
    if (cantidadDulces >= 3) {
      borrarDulces(posicionDulce, candyRow, 'filas');
      actualizarPuntaje(cantidadDulces);
    }
  }
}

function identDulces(srcComparison, dulceSrc, posicionDulce, posicionAdicionalDulce, flag, counter, index) {
  if (srcComparison != dulceSrc) {
    if (posicionDulce.length >= 3) {
      flag = true;
    } else {
      posicionDulce = [];
    }
    counter = 0;
  } else {

    if (counter == 0) {
      if (!flag) {
        posicionDulce.push(index - 1);
      } else {
        posicionAdicionalDulce.push(index - 1);
      }
    }
    if (!flag) {
      posicionDulce.push(index);
    } else {
      posicionAdicionalDulce.push(index);
    }
    counter += 1;
  }
}

function borrarDulces(posicionDulce, cfDulces, tipo) {
  if (tipo === 'columnas') {
    for (var i = 0; i < posicionDulce.length; i++) {
      cfDulces.eq(posicionDulce[i]).addClass('delete');
    }
  } else if (tipo === 'filas') {
    for (var i = 0; i < posicionDulce.length; i++) {
      cfDulces[posicionDulce[i]].addClass('delete');
    }
  }
}

function actualizarPuntaje(cantidadDulces) {
  var puntaje = Number($('#score-text').text());
  switch (cantidadDulces) {
    case 3:
      puntaje += 10;
      break;
    case 4:
      puntaje += 20;
      break;
    case 5:
      puntaje += 30;
      break;
    case 6:
      puntaje += 200;
      break;
    case 7:
      puntaje += 600;
  }
  $('#score-text').text(puntaje);
}

function validaciones() {
  validDulcesColumnas();
  validDulcesFilas();
  if ($('img.delete').length !== 0) {
    animacionEliminacionDulces();
  }
}

function denegarMovimiento() {
  $('img').draggable('disable');
  $('img').droppable('disable');
}

function permitirMovimiento() {
  $('img').draggable('enable');
  $('img').droppable('enable');
}

function animacionEliminacionDulces() {
  denegarMovimiento();
  $('img.delete').effect('pulsate', 400);
  $('img.delete').animate({
      opacity: '0'
    }, {
      duration: 300
    })
    .animate({
      opacity: '0'
    }, {
      duration: 400,
      complete: function() {
        deletesCandy()
          .then(function(result) {
            if (result) {
              verificarTablero();
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      },
      queue: true
    });
}

function deletesCandy() {
  return new Promise(function(resolve, reject) {
    if ($('img.delete').remove()) {
      resolve(true);
    } else {
      reject('¡No es posible la eliminación del dulce!');
    }
  });
}

function finJuego() {
  $('div.panel-tablero, div.time').effect('fold');
  $('div.score, div.moves, div.panel-score').width('100%');
  setTimeout(function() {
    $('h2.main-finish').addClass('title-over')
      .text('Juego Terminado');
  }, 500);
}

function init() {
  colorInicial();
  $('.btn-reinicio').click(function() {
    if ($(this).text() === 'Reiniciar') {
      location.reload(true);
    }
    verificarTablero();
    $(this).text('Reiniciar');
    cuentaRegresiva();
  });
}

function cuentaRegresiva() {
  var seconds = 60;
  var minuto = 1;
  var flag = false;
  var tiempo = setInterval(function() {
    seconds -= 1;
    if (seconds === 0) {
      seconds = 60;
      if (flag) {
        $('#timer').text('0:00');
        finJuego();
        clearInterval(tiempo);
      } else {
        flag = true;
        minuto = 0;
        $('#timer').text('1:00');
      }
    } else if (seconds > 0 && seconds < 10) {
      $('#timer').text(minuto + ':0' + seconds);
    } else if (minuto === 0) {
      $('#timer').text('0:' + seconds);
    } else {
      $('#timer').text(minuto + ':' + seconds);
    }

  }, 1000);
}

$(function() {
  init();
});
