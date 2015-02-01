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
	constructor: (@$, @formPlugin = "mathquill", @loadDomain = "cdn.", @loadPath="master", @loaded=no) ->
	render: (@formPlugin) -> @
	subdomain: (@loadDomain) -> @
	path: (@loadPath) -> @
	# Used internally to make sure all required scripts are loaded before binding to elements.
	load: (cb) ->
		if @loaded
			cb @ if cb
		if @formPlugin is "mathQuill"
			css = "https://#{@loadDomain}rawgit.com/CodeLenny/MathForm/#{@loadPath}/lib/mathquill.css"
			@$("head").append @$("<link rel='stylesheet' type='text/css' href='#{css}'>")
			@$.getScript("https://"+@loadDomain+"rawgit.com/CodeLenny/MathForm/"+@loadPath+"/lib/mathquill.min.js").done =>
				@loaded = yes
				cb @ if cb
		else if @formPlugin is "mathdox"
			@$.loadScript("http://mathdox.org/formulaeditor/main.js").done =>
				@loaded = yes
				cb @ if cb
	# Quick loader to bind to any element containing labelText in the input name.
	# Currently only binds to paragraph input.  Untested with line input.
	# Example: an input with the name "[Math] Test" would be bound with @google("[Math]")
	google: (labelText) ->
		@load =>
			@$(".ss-q-title").each (index, el) =>
				if @$(el).text().indexOf(labelText) > -1
					textbox = @$('#'+@$(el).parent("label.ss-q-item-label").attr("for"))
					form = @mathify(textbox)
					textbox.before(form)
	# Generate a form for the math input to be inserted.
	# Argument textbox should be a JQuery object to call .val(math) on when the user is done.
	mathify: (textbox) ->
		form = @$("<div>")
		if @formPlugin is "mathQuill"
			math = @$("<span>").mathquill("editable")
			save = @$("<button>").text("Save").click =>
				textbox.val math.mathquill().mathquill('latex')
			form.append(math).append(save)
		else if @formPlugin is "mathdox"
			alert("Unsupported Plugin.  This is an error in the link used to activate the math library.")
		return form
		

window.MathForm = MathForm