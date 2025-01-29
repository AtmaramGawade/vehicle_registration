import React, { useState, useEffect } from 'react';
import './VehicleRegistration.css';


class Block {
  constructor(timestamp, data, previousHash = '') {
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return JSON.stringify(this.data).length.toString(16) + 
           this.timestamp.toString(16) + 
           this.previousHash.toString(16);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(Date.now(), { vehicle: 'Genesis Vehicle' }, '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  isValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) return false;
      if (currentBlock.previousHash !== previousBlock.hash) return false;
    }
    return true;
  }
}

const VehicleRegistration = () => {
  const [blockchain, setBlockchain] = useState(new Blockchain());
  const [vehicleData, setVehicleData] = useState({
    vin: '',
    owner: '',
    make: '',
    model: '',
    year: ''
  });
  const [searchVin, setSearchVin] = useState('');

  useEffect(() => {
    const savedChain = localStorage.getItem('vehicleChain');
    if (savedChain) {
      const parsedChain = JSON.parse(savedChain);
      const newChain = new Blockchain();
      newChain.chain = parsedChain.chain.map(block => 
        new Block(block.timestamp, block.data, block.previousHash)
      );
      setBlockchain(newChain);
    }
  }, []);

  const handleInputChange = (e) => {
    setVehicleData({
      ...vehicleData,
      [e.target.name]: e.target.value
    });
  };

  const registerVehicle = () => {
    if (!Object.values(vehicleData).every(field => field.trim() !== '')) {
      alert('Please fill all fields');
      return;
    }

    const newBlock = new Block(Date.now(), vehicleData);
    const newBlockchain = new Blockchain();
    newBlockchain.chain = [...blockchain.chain];
    newBlockchain.addBlock(newBlock);
    
    setBlockchain(newBlockchain);
    localStorage.setItem('vehicleChain', JSON.stringify(newBlockchain));
    alert('Vehicle registered successfully!');
    setVehicleData({ vin: '', owner: '', make: '', model: '', year: '' });
  };

  const verifyChain = () => {
    alert(`Blockchain is ${blockchain.isValid() ? 'valid' : 'invalid'}`);
  };

  const findVehicle = () => {
    const foundBlock = blockchain.chain.find(block => 
      block.data.vin === searchVin
    );
    
    if (foundBlock) {
      alert(`Vehicle Found:\nOwner: ${foundBlock.data.owner}\nMake: ${foundBlock.data.make}`);
    } else {
      alert('Vehicle not found in registry');
    }
  };

  return (
    <div className="vehicle-registration">
      <h1>Blockchain Vehicle Registration</h1>
      
      <div className="registration-form">
        <h2>Register New Vehicle</h2>
          <input type="text" name="vin" placeholder="VIN" value={vehicleData.vin} onChange={handleInputChange} />
          <input type="text" name="owner" placeholder="Owner" value={vehicleData.owner} onChange={handleInputChange} />
          <input type="text" name="make" placeholder="Make" value={vehicleData.make} onChange={handleInputChange} />
          <input type="text" name="model" placeholder="Model" value={vehicleData.model} onChange={handleInputChange} />
          <input type="number" name="year" placeholder="Year" value={vehicleData.year} onChange={handleInputChange} />
          <button onClick={registerVehicle}>Register Vehicle</button>
      </div>

      <div className="search-vehicle">
        <h2>Search Vehicle</h2>
        <input 
          type="text" 
          placeholder="Enter VIN" 
          value={searchVin} 
          onChange={(e) => setSearchVin(e.target.value)} 
        />
        <button onClick={findVehicle}>Search</button>
      </div>

      <div className="blockchain-info">
          <h2>Blockchain Status</h2>
            <p>Blocks in chain: {blockchain.chain.length}</p>
        <button onClick={verifyChain}>Verify Chain Integrity</button>
      </div>
    </div>
  );
};

export default VehicleRegistration;