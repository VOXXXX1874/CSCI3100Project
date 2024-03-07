import React,{createContext,useState} from 'react';

const PageContext = createContext();

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
