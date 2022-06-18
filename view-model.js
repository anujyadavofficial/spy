var VM = {
  Specs: [
    {
      title: 'Only Two Input Elements',
      description: 'SG uses this approach.',
      index: 0,
    },
    {
      title: 'Many Input Elements',
      description: 'Vistara uses this',
      index: 1,
    },
  ],
  Rules: [{ id: 'Found exact two', confidence: 0.5 }],
  Renderer: {
    renderSpecs: function () {
      var template = $('#tmpl-spec').html();
      var templateScript = Handlebars.compile(template);

      Specs.forEach(function (spec) {
        var html = templateScript(spec);
        // Insert the HTML code into the page
        $('.list-group').append(html);
      });
    },
  },
};

VM.Renderer.renderSpecs();
