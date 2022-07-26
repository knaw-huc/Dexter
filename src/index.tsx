import React from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import { App } from "./App"
import { Collections } from "./Components/Collections"
import { Resources } from "./Components/Resources"

const container = document.getElementById("container")

// "createRoot(container!) is recommended by React docs: https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html. See line: "const root = createRoot(container); // createRoot(container!) if you use TypeScript"".
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!)

root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />}>
                <Route path="collections" element={<Collections />} />
                <Route path="resources" element={<Resources />} />
            </Route>
        </Routes>
    </BrowserRouter>
)
