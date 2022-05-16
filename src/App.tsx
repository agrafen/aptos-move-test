import React, { useEffect, useState } from 'react';

import { AptosClient, Types } from 'aptos';

import logo from './logo.svg';
import './App.css';

const client = new AptosClient('https://fullnode.devnet.aptoslabs.com');
// const address = '0x5af503b5c379bd69f46184304975e1ef1fa57f422dd193cdad67dc139d532481';

function stringToHex(text: string) {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(text);
  return Array.from(encoded, (i) => i.toString(16).padStart(2, '0')).join('');
}

function App() {
  const [address, setAddress] = React.useState<string | null>(null);
  const [modules, setModules] = useState<Types.MoveModule[]>([]);

  useEffect(() => {
    window.aptos.account().then(setAddress);
  }, []);

  useEffect(() => {
    if (!address) {
      return;
    }

    client.getAccountModules(address).then(setModules);
  }, [address]);

  console.log('address', address);
  
  console.log('modules', modules);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const message = 'test';
    const transaction = {
      type: 'script_function_payload',
      function: `${address}::Message::set_message`,
      arguments: [stringToHex(message)],
      type_arguments: [],
    };

    await window.aptos.signAndSubmitTransaction(transaction);
  };

  return (
    <>
      <button onClick={handleSubmit}>sign and submit!</button>
    </>
  );
}

export default App;
