const functions = ['typeahead']
  
  const loadFunctions = (funcs:Array<string>) => {
      for(let name of functions){
          if(! process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === name) {
            exports[name] = require('./'+name);
        }
      }
  }
  
  console.log('process.env.FUNCTION_NAME:', process.env.FUNCTION_NAME)
  loadFunctions(functions)
  console.log('exports:', exports)
