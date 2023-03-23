import React from "react";
import { useParams } from "react-router-dom";



function Details() {
    const { name, version } = useParams<{ name: string, version: string }>();

    return (
        <div>
            <h1>Details</h1>
            <p>Name: {name}</p>
            <p>Version: {version}</p>
        </div>
    );

}

export default Details;