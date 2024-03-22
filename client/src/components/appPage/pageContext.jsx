import React,{createContext,useState} from 'react';

// Create the page context
const PageContext = createContext();

// Provide the page context and related functions for other component
const PageProvider = ({children}) => {
    const [page,setPage] = useState(0);

    function login(){
      setPage(1);
    };

    function logout(){
      setPage(0);
    }

    function startGame(){
      setPage(2);
    }

    function modifySettings(){
      setPage(3);
    }

    return (  
        <PageContext.Provider value={{ page, login, logout, startGame, modifySettings }}>  
          {children}  
        </PageContext.Provider>  
      );  
}

export { PageContext, PageProvider };
