import * as  bodyParser from 'body-parser';
import * as express from 'express';

import {Block, generateNextBlock, getBlockchain} from './blockchain';
import {connectToPeers, getSockets, initP2PServer} from './p2p';


const serchHttpPort = () => {
    if (process.env.HTTP_PORT === undefined) {
        return 3001;
    } else {
        return parseInt(process.env.HTTP_PORT, 10);
    }
};
const httpPort = serchHttpPort();

const setrchP2pPort = () => {
    if (process.env.P2P_PORT === undefined) {
        return 6001;
    } else {
        return parseInt(process.env.P2P_PORT, 10);
    }
}
const p2pPort = setrchP2pPort();

const initHttpServer = (myHeepPort: number ) => {
    const app = express();
    app.use(bodyParser.json());

    app.get('/blocks', (req, res) => {
        res.send(getBlockchain());
    });
    app.post('/mineBlock', (req,res) => {
        const newBlock: Block = generateNextBlock(req.body.data);
        res.send(newBlock);
    });
    app.get('/peers', (req, res) => {
        res.send(getSockets().map(( s: any ) => s._socket.remoteAddress + ':' + s._socket.remotePort));
    });
    app.post('/addPeer', (req, res) => {
        connectToPeers(req.body.peer);
        res.send();
    });

    app.listen(myHeepPort, () => {
        console.log('Listening http on port: ' + myHeepPort);
    });
};

initHttpServer(httpPort);
initP2PServer(p2pPort);