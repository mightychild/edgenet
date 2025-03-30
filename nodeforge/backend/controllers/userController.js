const User = require('../models/User');
const { ethers } = require('ethers'); // For verifying signatures

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const updateWalletAddress = async (req, res) => {
  const { walletAddress } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.walletAddress = walletAddress;
    await user.save();

    res.status(200).json({ message: 'Wallet address updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const disconnectWallet = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.walletAddress = ''; // Clear the wallet address
    await user.save();

    res.status(200).json({ message: 'Wallet disconnected successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyWalletOwnership = async (req, res) => {
  const { walletAddress, signature } = req.body;

  try {
    // Fetch the user and their nonce
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify the signature
    const message = `Verify wallet ownership for EdgeNet. Nonce: ${user.nonce}`;
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Update the user's wallet address and generate a new nonce
    user.walletAddress = walletAddress;
    user.nonce = Math.floor(Math.random() * 1000000).toString(); // Generate a new nonce
    await user.save();

    res.status(200).json({ message: 'Wallet ownership verified successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getUser, updateWalletAddress, disconnectWallet, verifyWalletOwnership };
