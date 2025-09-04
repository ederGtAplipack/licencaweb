import React from 'react';
import Routes from './Routers';
//import 'bootstrap/dist/css/bootstrap.min.css'; 
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'; 

/*
  Componente principal da aplicação.
  Renderiza o componente de rotas para gerenciar a navegação entre páginas.
*/
function App() {
    return (
        <Routes/>
    );
}

export default App;
