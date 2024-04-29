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
 * @module      plugintype_pluginname/commands
 * @copyright   2024 Aniket Kumar <aniketkj9211@gmail.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {getButtonImage} from "editor_tiny/utils";
import {get_string as getString} from "core/str";
import {component, icon} from "./common";
import {ChemEmbed, insert} from "./ui";
import {notify} from 'core/notification';

const handleAction = async(editor) => {
  const chemImage = new ChemEmbed(editor);
  chemImage.init();

  const insertButton = document.getElementById('insertButton');

  if (insertButton) {
    insertButton.addEventListener('click', insert);
  } else {
    notify.addNotification({
      type: 'error',
      message: 'Insert button not found in the DOM.'
    });
  }

};

export const getSetup = async() => {
  try {
    const buttonName = await getString("buttonName", component);
    const buttonImage = await getButtonImage("icon", component);

    return (editor) => {
      editor.ui.registry.addIcon(icon, buttonImage.html);

      editor.ui.registry.addButton(buttonName, {
        icon,
        tooltip: buttonName,
        onAction: () => handleAction(editor),
      });

      editor.ui.registry.addMenuItem(buttonName, {
        icon,
        text: buttonName,
        onAction: () => handleAction(editor),
      });
    };

  } catch (error) {
    notify.addNotification({
      type: 'error',
      message: 'Error setting up the tiny_chemdraw plugin: ' + error.message
    });
    return null;
  }
};
