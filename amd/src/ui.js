import Modal from "core/modal";
import Templates from "core/templates";

class MyModal extends Modal {
  static TYPE = "tiny_moldraw/moldraw";
  static TEMPLATE = "tiny_moldraw/moldraw";
  configure(modalConfig) {
    // Show this modal on instantiation.
    modalConfig.show = true;
    // Remove from the DOM on close.
    modalConfig.removeOnClose = true;
  }
}

export const handleAction = async () => {
  await MyModal.create();
};

/**
 * @param {*} url
 * @param { }type
 */
async function loadResource(url, type) {
  return new Promise((resolve, reject) => {
    if (type === "script") {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.onload = resolve;
      script.onerror = reject;
      script.src = url;
      document.getElementsByTagName("body")[0].appendChild(script);
    } else if (type === "stylesheet") {
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.type = "text/css";
      link.onload = resolve;
      link.onerror = reject;
      link.href = url;
      document.getElementsByTagName("head")[0].appendChild(link);
    } else {
      reject(new Error("Invalid resource type"));
    }
  });
}

/**
 *
 */
async function loadAndRunAnotherFunction() {
  try {
    await loadResource("../../ChemDoodle/install/ChemDoodleWeb.css", "stylesheet");
    await loadResource("../../ChemDoodle/install/uis/jquery-ui-1.11.4.css", "stylesheet");
    await loadResource("../../ChemDoodle/install/ChemDoodleWeb.js", "script");
    await loadResource("../../ChemDoodle/install/uis/ChemDoodleWeb-uis.js", "script");
    await loadResource("../../chem/chem.css", "stylesheet");

    // All resources are loaded, now you can execute your code
    // For example, you can run the provided script here

    ChemDoodle.ELEMENT["H"].jmolColor = "black";
    ChemDoodle.ELEMENT["S"].jmolColor = "#B9A130";
    // Main ketcher.
    const sketcher = new ChemDoodle.SketcherCanvas("sketcher", 600, 350, {
      useServices: false,
      requireStartingAtom: false,
    });
    // We init the ketcher with an empty molecule object.
    sketcher.styles.atoms_displayTerminalCarbonLabels_2D = true;
    sketcher.styles.atoms_useJMOLColors = true;
    sketcher.styles.bonds_clearOverlaps_2D = true;
    sketcher.styles.shapes_color = "#c10000";
    sketcher.repaint();

    // Preview ketcher.
    const sketcherViewer = new ChemDoodle.ViewerCanvas(
      "sketcher-viewer-atto",
      100,
      100
    );
    sketcherViewer.styles.atoms_displayTerminalCarbonLabels_2D = true;
    sketcherViewer.styles.atoms_useJMOLColors = true;
    sketcherViewer.styles.bonds_clearOverlaps_2D = true;

    sketcherViewer.emptyMessage = "No data loaded";
    sketcher.oldFunc = sketcher.checksOnAction;

    /*   Refactor the function, in order for the preview ketcher to be a copy of the main ketcher,
         updated at every modification of the main ketcher. */
    sketcher.checksOnAction = function (force) {
      this.oldFunc(force);
      let mols = sketcher.molecules;
      let forms = sketcher.shapes;
      sketcherViewer.loadContent(mols, forms);
      sketcher.center();
      for (let i = 0, ii = this.molecules.length; i < ii; i++) {
        this.molecules[i].check();
      }
    }

    // eslint - disable - next - line no - console
    console.log("All resources loaded successfully.");
  } catch {
    console.log("error");
  }
}
// Call the function to load all resources and run the provided script



function function_resize() {
  let input_width = document.getElementById('width_input_molstructure').valueAsNumber;
  let input_height = document.getElementById('height_input_molstructure').valueAsNumber;
  let width;
  let height;

  if (input_width > 0) {
    width = input_width;
  } else {
    width = 100;
  }
  if (input_height > 0) {
    height = input_height;
  } else {
    height = 100;
  }
  sketcherViewer.resize(width, height);
}

function insert() {
  if (window.parent.tinyMCE && window.parent.tinyMCE.activeEditor) {
    let mol = sketcherViewer.getMolecule();
    let src = ChemDoodle.io.png.string(sketcherViewer);
    let molFile = ChemDoodle.writeMOL(mol);
    let width = document.getElementById('width_input_molstructure').valueAsNumber;
    let height = document.getElementById('height_input_molstructure').valueAsNumber;
    var content =
      '<img src="' +
      src +
      '" width="' +
      width +
      'px" height="' +
      height +
      'px">';

    window.parent.tinyMCE.activeEditor.execCommand(
      "mceInsertContent",
      0,
      content
    );
    window.parent.tinyMCE.activeEditor.execCommand(
      "mceInsertContent",
      0,
      "<!--" + molFile + "-->"
    );
    var modal = window.parent.document.querySelector('.modal');
    var closeButton = modal.querySelector('.close');
    closeButton.click();
  }
  console.log("button Click")
}
