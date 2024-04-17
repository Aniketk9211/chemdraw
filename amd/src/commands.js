// This file is part of Moodle - https://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

/**
 * Commands helper for the Moodle tiny_chemdraw plugin.
 *
 * @module      plugintype_pluginname/commands
 * @copyright   2024 Aniket Kumar <aniketkj9211@gmail.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {getButtonImage} from "editor_tiny/utils";
import {get_string as getString} from "core/str";
import {handleAction} from "./ui";
import {component, startMolDrawButtonName, startMolDrawMenuItemName, icon} from "./common";

/**
 * Handle the action for your plugin.
 * @param {TinyMCE.editor} editor The tinyMCE editor instance.
 */
// handle Action funciton..


/**
 * Get the setup function for the buttons.
 *
 * This is performed in an async function which ultimately returns the registration function as the
 * Tiny.AddOnManager.Add() function does not support async functions.
 *
 * @returns {function} The registration function to call within the Plugin.add function.
 */
export const getSetup = async() => {
    try {
      const [startMolDrawButtonNameTitle, startMolDrawMenuItemNameTitle, buttonImage] = await Promise.all([
        getString("button_startMolDraw", component),
        getString("menuitem_startMolDraw", component),
        getButtonImage("icon", component),
      ]);
  
      return (editor) => {
        editor.ui.registry.addIcon(icon, buttonImage.html);
  
        editor.ui.registry.addButton(startMolDrawButtonName, {
          icon,
          tooltip: startMolDrawButtonNameTitle,
          onAction: () => handleAction(editor),
        });
  
        editor.ui.registry.addMenuItem(startMolDrawMenuItemName, {
          icon,
          text: startMolDrawMenuItemNameTitle,
          onAction: () => handleAction(editor),
        });
      };
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert("Error setting up plugin:", error);
    }
  };
