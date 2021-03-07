var pdfjsLib = require("pdfjs-dist");

const canvasUtils = (visor) => ({
  create: (width, height) => {
    if (width <= 0 || height <= 0) {
      throw new Error("Invalid canvas size");
    }
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    visor.container.appendChild(canvas);
    return {
      canvas,
      context,
    };
  },
});

const toolsbarActions = (visor, options) => ({
  upZoom: (num) => {
    options.scale += num;
    visor.renderPage(visor.pageNum);
  },
  downZoom: (num) => {
    options.scale -= num;
    visor.renderPage(visor.pageNum);
  },
  nextPage: () => {
    if (visor.pageNum >= visor.pdfDoc.numPages) {
      return;
    }
    visor.pageNum++;
    visor.renderPage(visor.pageNum);
  },
  prevPage: () => {
    if (visor.pageNum <= 1) {
      return;
    }
    visor.pageNum--;
    visor.renderPage(visor.pageNum);
  },
});

const PDFViewer = (userOptions) => {
  const options = Object.assign(
    {
      container: "canvas",
      canvas: null,
      scale: 1,
      toolsbar: {
        pageCount: "pageCount",
        pageNum: "pageNum",
        prev: "prev",
        next: "next",
        upZoom: "upZoom",
        downZoom: "downZoom",
      },
    },
    userOptions
  );

  const visor = {
    container: options.container,
    pdfjs: pdfjsLib,
    source: null,
    pdfDoc: null,
    pageNum: 1,
    pageRendering: false,
    pageNumPending: null,
    canvasPage: null,
  };

  const toolsbar = {
    pageCount: document.getElementById(options.toolsbar.pageCount),
    pageNum: document.getElementById(options.toolsbar.pageNum),
    prev: document.getElementById(options.toolsbar.prev),
    next: document.getElementById(options.toolsbar.next),
    upZoom: document.getElementById(options.toolsbar.upZoom),
    downZoom: document.getElementById(options.toolsbar.downZoom),
  };

  const events = {
    upZoomEvent() {
      visor.upZoom(0.1);
    },
    downZoomEvent() {
      visor.downZoom(0.1);
    },
  };

  const initialize = (visor, options, toolsbar, events) => ({
    loadLibrary: (lib) => (visor.pdfjs = lib),
    loadSource: (source) => (visor.source = source),
    init: () => {
      // init pdfjs
      visor.pdfjs.getDocument(visor.source).promise.then(function (pdfDoc_) {
        visor.pdfDoc = pdfDoc_;
        toolsbar.pageCount.textContent = visor.pdfDoc.numPages;

        // initial/first page rendering
        visor.renderPage(visor.pageNum);
      });
    },
    initializeEvents: () => {
      // init events toolsbar
      toolsbar.next.addEventListener("click", visor.nextPage, true);
      toolsbar.prev.addEventListener("click", visor.prevPage, true);
      toolsbar.upZoom.addEventListener("click", events.upZoomEvent, true);
      toolsbar.downZoom.addEventListener("click", events.downZoomEvent, true);
    },
    renderPage: (num) => {
      visor.pageRendering = true;
      // Using promise to fetch the page
      visor.pdfDoc.getPage(num).then(function (page) {
        let viewport = page.getViewport({ scale: options.scale });
        /* if (visor.canvasPage) {
          visor.container.removeChild(visor.canvasPage.canvas);
        } 
        visor.canvasPage = visor.create(viewport.width, viewport.height); */
        if (!visor.canvasPage) {
          visor.canvasPage = visor.create(viewport.width, viewport.height);
        } else {
          visor.canvasPage.canvas.width = viewport.width;
          visor.canvasPage.canvas.height = viewport.height;
        }

        // Render PDF page into canvas context
        let renderContext = {
          canvasContext: visor.canvasPage.context,
          viewport: viewport,
        };
        renderTask = page.render(renderContext);
        // Wait for rendering to finish
        renderTask.promise.then(function () {
          visor.pageRendering = false;
          if (visor.pageNumPending !== null) {
            // New page rendering is pending
            visor.renderPage(visor.pageNumPending);
            visor.pageNumPending = null;
          }
        });
      });

      // Update page counters
      toolsbar.pageNum.textContent = visor.pageNum;
    },
    reset: () => {
      visor.source = "";
      visor.pdfDoc = null;
      visor.pageNum = 1;
      visor.pageRendering = false;
      visor.pageNumPending = null;
      options.canvas = null;
      options.scale = 1;
      visor.canvasPage = null;
    },
  });

  return Object.assign(
    visor,
    initialize(visor, options, toolsbar, events),
    toolsbarActions(visor, options),
    canvasUtils(visor)
  );
};

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "js/livewire/components/pdf.worker.min.js";

window.PDFViewer = PDFViewer;
