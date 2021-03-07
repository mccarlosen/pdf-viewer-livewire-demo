<?php

namespace App\Http\Livewire\Components;

use Livewire\Component;

class PdfViewer extends Component
{
  public $openModal = false;
  public $titleModal = "PDF Viewer";
  public $url = "";

  protected $listeners = ["showModal"];

  public function updatedOpenModal()
  {
    if (!$this->openModal) {
      $this->url = "";
    }
  }

  public function showModal($doc)
  {
    $this->openModal = true;
    $this->url = $doc["url"];
    $this->titleModal =(isset($doc["title"]) && !empty($doc["title"])) ? $doc["title"] : $this->titleModal;
  }

  public function render()
  {
    return view("livewire.components.pdf-viewer");
  }
}