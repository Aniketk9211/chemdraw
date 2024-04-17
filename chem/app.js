async function loadResource(url, type) {
    return new Promise((resolve, reject) => {
        if (type === 'script') {
            var script = document.createElement("script");
            script.type = "text/javascript";  
            script.onload = resolve;
            script.onerror = reject;
            script.src = url;
            document.getElementsByTagName("head")[0].appendChild(script);
        } else if (type === 'stylesheet') {
            var link = document.createElement("link");
            link.rel = "stylesheet";
            link.type = "text/css";
            link.onload = resolve;
            link.onerror = reject;
            link.href = url;
            document.getElementsByTagName("head")[0].appendChild(link);
        } else {
            reject(new Error('Invalid resource type'));
        }
    });
}

async function loadAndRunAnotherFunction() {
    try {
        await Promise.all([
            loadResource("../../ChemDoodle/install/ChemDoodleWeb.css", 'stylesheet'),
            loadResource("../../ChemDoodle/install/uis/jquery-ui-1.11.4.css", 'stylesheet'),
            loadResource("../../ChemDoodle/install/ChemDoodleWeb.js", 'script'),
            loadResource("../../ChemDoodle/install/uis/ChemDoodleWeb-uis.js", 'script'),
            loadResource("../../chem/chem.css", 'stylesheet')
        ]);

        // All resources are loaded, now you can execute your code
        // For example, you can run the provided script here

        ChemDoodle.ELEMENT['H'].jmolColor = 'black';
        ChemDoodle.ELEMENT['S'].jmolColor = '#B9A130';
        // Main ketcher.
        const sketcher = new ChemDoodle.SketcherCanvas('sketcher', 600, 350, { useServices: false, requireStartingAtom: false });
        // We init the ketcher with an empty molecule object.
        sketcher.styles.atoms_displayTerminalCarbonLabels_2D = true;
        sketcher.styles.atoms_useJMOLColors = true;
        sketcher.styles.bonds_clearOverlaps_2D = true;
        sketcher.styles.shapes_color = "#c10000";
        sketcher.repaint();


        // Preview ketcher.
        const sketcher_viewer = new ChemDoodle.ViewerCanvas('sketcher-viewer-atto', 100, 100);
        sketcher_viewer.styles.atoms_displayTerminalCarbonLabels_2D = true;
        sketcher_viewer.styles.atoms_useJMOLColors = true;
        sketcher_viewer.styles.bonds_clearOverlaps_2D = true;
        //sketcher_viewer.repaint();
        sketcher_viewer.emptyMessage = 'No data loaded';
        sketcher.oldFunc = sketcher.checksOnAction;

        /*   Refactor the function, in order for the preview ketcher to be a copy of the main ketcher,
             updated at every modification of the main ketcher. */
        sketcher.checksOnAction = function (force) {
            this.oldFunc(force);
            //sketcher.repaint();
            let mols = sketcher.molecules;
            let forms = sketcher.shapes;
            sketcher_viewer.loadContent(mols, forms);
            sketcher.center();
            for (let i = 0, ii = this.molecules.length; i < ii; i++) {
                this.molecules[i].check();
            }
        }

        /*  Button activated function, checks for the values of width and height in the input elements.
            If empty, uses the default value. */
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
                // console.log('inif');
                height = input_height;
            } else {
                // console.log('inelse');
                height = 100;
            }
            sketcher_viewer.resize(width, height);
        }
        function insert() {
            if (window.parent.tinyMCE && window.parent.tinyMCE.activeEditor) {
                let mol = sketcher_viewer.getMolecule();
                let src = ChemDoodle.io.png.string(sketcher_viewer);
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
        console.log("All resources loaded successfully.");
    } catch (error) {
        console.error("Error loading resources:", error);
    }
}

// Call the function to load all resources and run the provided script
loadAndRunAnotherFunction();
