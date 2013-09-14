define(['durandal/system', 'knockout'],
  function( system, ko ) {

      var dFiddleRepoSource = 'http://rainerat.spirit.de/dSortable/tree/gh-pages/app/';

      var isDFiddle = ko.observable(false);
      var dFiddleRepoUrl = ko.observable('');
      var categories = ko.observableArray([
          {id: 'intro', text: 'Basic Examples'},
          {id: 'detailed', text: 'Detailed Examples'},
          {id: 'fiddle', text: 'Fiddles'}
      ]);

      return {
          isDFiddle: isDFiddle,
          dFiddleRepoUrl: dFiddleRepoUrl,
          createSampleLink: createSampleLink,
          categories: categories
      };

      function createSampleLink ( instance, instruction, router ) {
          if ( instruction && instruction.config && instruction.config.type ) {
              isDFiddle(instruction.config.type === 'fiddle');
          }
          dFiddleRepoUrl(dFiddleRepoSource + instance.__moduleId__ + '.js');
      }
  });
