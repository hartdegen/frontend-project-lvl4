// @ts-check

import "core-js/stable/index.js";
import "regenerator-runtime/runtime.js";
import "../assets/application.scss";

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import App from "./components/App.jsx";
import store from "./slices/index.js";

if (process.env.NODE_ENV !== "production") {
    localStorage.debug = "chat:*";
}

// const p = document.createElement('p');
// p.classList.add('card-text');
// p.textContent = 'It works!';

// const h5 = document.createElement('h5');
// h5.classList.add('card-title');
// h5.textContent = 'Project frontend l4 boilerplate';

// const cardBody = document.createElement('div');
// cardBody.classList.add('card-body');
// cardBody.append(h5, p);

// const card = document.createElement('div');
// card.classList.add('card', 'text-center');
// card.append(cardBody);

// const container = document.querySelector('#chat');
// container.append(card);

// const mountNode = document.getElementById('chat');
// const root = ReactDOM.createRoot(card);
// root.render(<div>lol</div>);

const container = document.querySelector("#chat");
const root = ReactDOM.createRoot(container);
root.render(
    <BrowserRouter>
        <Provider store={store}>
            <App />
        </Provider>
    </BrowserRouter>
);

console.log("it works!");
