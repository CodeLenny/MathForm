# MathForm is A simple mashup to add math formula editing to online forms.
# Copyright 2015 Ryan Leonard
# Copyright information may have been updated more recently.
# See README.md for more info.

# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.

# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.

# You should have received a copy of the GNU General Public License
# along with this program, called "LICENSE".  If not, see <http://www.gnu.org/licenses/>.

class MathForm
	# The individual calls (@render(), @subdomain(), @path(), etc.) are prefered.
	# However, make sure to pass @$.
	constructor: (@$, @formPlugin = "mathquill", @loadDomain = "cdn.", @loadPath="master", @loaded=no, @developerMode=no) ->
	render: (@formPlugin) -> @
	subdomain: (@loadDomain) -> @
	path: (@loadPath) -> @
	devel: -> @developerMode = true; @
	# Used internally to make sure all required scripts are loaded before binding to elements.
	load: (cb) ->
		if @loaded
			cb @ if cb
		if @formPlugin is "mathQuill"
			css = "https://#{@loadDomain}rawgit.com/CodeLenny/MathForm/#{@loadPath}/lib/mathquill.css"
			@$("head").append @$("<link rel='stylesheet' type='text/css' href='#{css}'>")
			temp = window.$
			tempjQuery = window.jQuery
			window.$ = @$
			window.jQuery = @$
			ext = if @developerMode then ".js" else ".min.js"
			@$.getScript("https://"+@loadDomain+"rawgit.com/CodeLenny/MathForm/"+@loadPath+"/lib/mathquill#{ext}").done =>
				@loaded = yes
				cb @ if cb
				#window.$ = temp
				#window.jQuery = tempjQuery
		else if @formPlugin is "mathdox"
			@$.loadScript("http://mathdox.org/formulaeditor/main.js").done =>
				@loaded = yes
				cb @ if cb
	# Quick loader to bind to any element containing labelText in the input name.
	# Currently only binds to paragraph input.  Untested with line input.
	# Example: an input with the name "[Math] Test" would be bound with @google("[Math]")
	google: (labelText) ->
		@load =>
			if window.location.pathname.indexOf("viewform") > -1
				@$(".ss-q-title").each (index, el) =>
					if @$(el).text().indexOf(labelText) > -1
						textbox = @$('#'+@$(el).parent("label.ss-q-item-label").attr("for"))
						form = @mathify(textbox)
						textbox.before(form)
				version = if @developerMode or @loadDomain is "" then "Developer Version.  Please use a standard version for production!" else "Version #{@loadPath}."
				@$(".ss-form-desc").after $("<b>").text """
					MathForm loaded, using #{@formPlugin} as the render engine.
					MathForm #{version}
				"""
			@googleEditor(labelText)
	# Loads the plugin into a Google Form for editing.
	googleEditor: (labelText) ->
		@$("body").on("click", ".goog-inline-block.goog-flat-menu-button-caption", @googleEditDropdownClick)
	googleEditorItem: (id, name, cb) ->
		item = @$("<div />").addClass("goog-menuitem").attr
			role: "menuitem"
			style: "-webkit-user-select: none;"
			id: ":r#{id}"
		text = @$("<div />").addClass("goog-menuitem-content")
			.attr "style", "-webkit-user-select: none;"
			.text name
			.click cb
			.appendTo item
		return item
	googleEditorCreateMath: =>
		name = @$(".ss-formwidget-container-editor #:fk.fw_tf")
		if not name.val().indexOf(labelText) > -1
			name.val labelText + " " + name.val()
	googleEditorCreateEmbeddedMath: =>
		name = @$(".ss-formwidget-container-editor #:fk.fw_tf")
		if not name.val().indexOf("[MathSentance]") > -1
			name.val "[MathSentance] " + name.val()
	googleEditorDropdownClick: =>
		@$(".goog-menu.goog-menu-vertical[aria-haspopup='true'] [id^=':r']").remove()
		menu = @$(".goog-menu.goog-menu-vertical[aria-haspopup='true']")
		math = @googleEditorItem("1", "Math", @googleEditorCreateMath)
		embedMath = @googleEditorItem("2", "Math Enabled Text", @googleEditorCreateEmbededMath)
		menu.append(math).append(embedMath)
	checkVersion: ->
		check = @$(".mathFormVersionCheck")
		return if check.length < 0
		if check.text() is @loadPath
			@$(".mathFormVersionCheckResults").removeClass("bg-info").addClass("bg-success").text """
				Congrats! You are running the latest version of MathForm.
			"""
		else
			@$(".mathFormVersionCheckResults").removeClass("bg-info").addClass("bg-danger").text """
				Warning: You are running an outdated version of MathForm.
				Please replace your bookmarklet.
			"""
	# Generate a form for the math input to be inserted.
	# Argument textbox should be a JQuery object to call .val(math) on when the user is done.
	mathify: (textbox) ->
		form = @$("<div>")
		if @formPlugin is "mathQuill"
			math = @$("<span>").mathquill("editable")
			math.mathquill 'latex', textbox.val()
			save = @$("<button>").text("Save").click (e) =>
				e.preventDefault()
				textbox.val math.mathquill('latex')
				false
			form.append(math).append(save)
		else if @formPlugin is "mathdox"
			alert("Unsupported Plugin.  This is an error in the link used to activate the math library.")
		return form
		

window.MathForm = MathForm