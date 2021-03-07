<?php

namespace App\Http\Livewire;

use Livewire\Component;

class Demo extends Component
{
  public function showDocument()
  {
    $doc = url("demo-document.pdf");
    $this->emitTo("components.pdf-viewer", "showModal", [
      "url" => $doc,
      "title" => "Demo Document",
    ]);
  }

  public function render()
  {
      return view('livewire.demo');
  }
}