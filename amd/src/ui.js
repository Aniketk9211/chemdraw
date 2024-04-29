// This file is part of Moodle - https://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle. If not, see <https://www.gnu.org/licenses/>.

/**
 * Commands helper for the Moodle tiny_chemdraw plugin.
 *
 * @module      plugintype_pluginname/ui
 * @copyright   2024 Aniket Kumar <aniketkj9211@gmail.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {get_string as getString} from 'core/str';
import Templates from 'core/templates';
import Modal from 'core/modal';
import Config from 'core/config';
import {exception as displayException} from 'core/notification';


export const ChemEmbed = class {
  editor = null;
  constructor(editor) {
    this.editor = editor;
  }

  loadResource = async(url, type) => {
    return new Promise((resolve, reject) => {
      const element = (type === "script") ? document.createElement("script") : document.createElement("link");
      element.onload = resolve;
      element.onerror = () => reject(new Error(`Failed to load ${type}: ${url}`));
      if (type === "stylesheet") {
        element.rel = 'stylesheet';
        element.href = url;
      } else if (type === "script") {
        element.src = url;}
      document[type === "script" ? 'body' : 'head'].appendChild(element);
    });
  };

  initializeChemDoodle = () => {
    try {
      ChemDoodle.ELEMENT["H"].jmolColor = "black";
      ChemDoodle.ELEMENT["S"].jmolColor = "#B9A130";

      // Main ketcher initialization
      const sketcher = new ChemDoodle.SketcherCanvas("sketcher", 600, 350, {
        useServices: false,
        requireStartingAtom: false,
      });
      // Additional initialization for ChemDoodle goes here...
      sketcher.styles.atoms_displayTerminalCarbonLabels_2D = true;
      sketcher.styles.atoms_useJMOLColors = true;
      sketcher.styles.bonds_clearOverlaps_2D = true;
      sketcher.styles.shapes_color = "#c10000";
      sketcher.repaint();
      // Preview ketcher initialization
      const sketcherViewer = new ChemDoodle.ViewerCanvas("sketcher-viewer-atto", 100, 100);
      sketcherViewer.emptyMessage = "No data loaded";
      sketcherViewer.styles.atoms_displayTerminalCarbonLabels_2D = true;
      sketcherViewer.styles.atoms_useJMOLColors = true;
      sketcherViewer.styles.bonds_clearOverlaps_2D = true;
      sketcher.oldFunc = sketcher.checksOnAction;
      sketcher.checksOnAction = function (force) {
        this.oldFunc(force);
        let mols = sketcher.molecules;
        let forms = sketcher.shapes;
        sketcherViewer.loadContent(mols, forms);
        sketcher.center();
        for (let i = 0, ii = this.molecules.length; i < ii; i++) {
          this.molecules[i].check();
        }
      };
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  init = async() => {
    try {
      const modal = await Modal.create({
        title: getString('sketchtitle'),
        show: true,
        removeOnClose: true,
      });
      Templates.renderForPromise('tiny_chemdraw/chemTemplate', {})
        .then(async ({ html, js }) => {
          Templates.appendNodeContents(modal.getBody(), html, js);
          const resources = [
            `${Config.wwwroot}/lib/editor/tiny/plugins/chemdraw/ChemDoodle/install/ChemDoodleWeb.css`,
            `${Config.wwwroot}/lib/editor/tiny/plugins/chemdraw/ChemDoodle/install/uis/jquery-ui-1.11.4.css`,
            `${Config.wwwroot}/lib/editor/tiny/plugins/chemdraw/ChemDoodle/install/ChemDoodleWeb.js`,
            `${Config.wwwroot}/lib/editor/tiny/plugins/chemdraw/ChemDoodle/install/uis/ChemDoodleWeb-uis.js`,
            `${Config.wwwroot}/lib/editor/tiny/plugins/chemdraw/chem/chem.css`
          ];

          const types = ["stylesheet", "stylesheet", "script", "script", "stylesheet"];

          for (let i = 0; i < resources.length; i++) {
            await loadResource(resources[i], types[i]);
          }

          // Add this line to fix the model width.
          window.parent.document.querySelector(".modal-dialog").style.maxWidth = '850px';

          // Load and run ChemDoodle functionality
          await loadAndRunChemDoodle();
        }) 
    } catch (error) {
      displayException(error);
    }
  };
}

export const insert = () => {
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
  console.log("button Click");
};