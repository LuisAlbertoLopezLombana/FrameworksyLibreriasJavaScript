$(function() {

  /*
   * Control de título Match Game, animación cambio de color.
   * Función colorInicial
   */
  function colorInicial() {
    $("h1").animate({
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
    $("h1").animate({
      color: "#FFFFFF"
    }, 0, "", function() {
      setTimeout(function() {
        colorInicial();
      }, 1000);
    });
  }

  colorInicial();
})
