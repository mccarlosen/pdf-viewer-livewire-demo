<div
  x-data="{ 
  open: @entangle('openModal'),
  url: @entangle('url'),
  visorPDF: null
}"
  x-init="
  visorPDF = VisorPDF({
    container: $refs.viewer,
    canvas: null
  })
  $watch('url', function (url) {
    if (url) {
      visorPDF.loadSource(url);
      visorPDF.init();
    } else {
      visorPDF.reset();
    }
  })
"
  class="modal animated fadeIn {{ $openModal ? 'is-active' : '' }}"
>
  <div class="modal-background"></div>
  <div
    class="modal-card"
    style="width: 100%; max-width: 100%; height: 100%; max-height: 100vh"
  >
    <header class="modal-card-head py-2 px-3 is-radiusless">
      <p class="modal-card-title is-size-6 has-text-weight-bold mb-0">
        {{ $this->titleModal }}
      </p>
      <button class="delete" aria-label="close" @click="open = false"></button>
    </header>
    <section
      class="modal-card-body is-flex is-justify-content-center has-background-grey-dark"
    >
      <div x-ref="viewer"></div>
    </section>
    <footer
      class="modal-card-foot is-justify-content-flex-end py-2 px-3 is-radiusless"
    >
      <div class="mr-4">
        <span
          >Página: <span id="pageNum"></span> / <span id="pageCount"></span
        ></span>
      </div>
      <button
        @click="visorPDF.prevPage()"
        id="prev"
        type="button"
        class="button is-small is-success"
      >
        <i class="fas fa-chevron-left"></i>
      </button>
      <button
        @click="visorPDF.nextPage()"
        id="next"
        type="button"
        class="button is-small is-success"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
      <button
        @click="visorPDF.upZoom(0.1)"
        id="upZoom"
        type="button"
        class="button is-small is-primary"
      >
        <i class="fas fa-search-plus"></i>
      </button>
      <button
        @click="visorPDF.downZoom(0.1)"
        id="downZoom"
        type="button"
        class="button is-small is-primary"
      >
        <i class="fas fa-search-minus"></i>
      </button>
      <button class="button is-small" @click="open = false">Cerrar</button>
    </footer>
  </div>
</div>
