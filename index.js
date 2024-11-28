// Import dependencies
import { ethers } from "ethers";
import fs from "fs/promises";

// Sepolia network provider
const provider = new ethers.JsonRpcProvider("https://holesky.infura.io/v3/<your key>");

// Helper function to introduce a random delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function checkBalances() {
  const results = []; // Array to store results for summarizing

  try {
    // Read wallet addresses from the text file
    const data = await fs.readFile("addresses.txt", "utf-8");
    const walletAddresses = data.split("\n").map((line) => line.trim()).filter(Boolean);

    // Iterate over each address
    for (const address of walletAddresses) {
      try {
        // Fetch the balance of the address
        const balanceWei = await provider.getBalance(address);
        const balanceEth = parseFloat(ethers.formatEther(balanceWei));

        // Log and store the result with readable formatting
        console.log(`Address: ${address} | Balance: ${balanceEth.toFixed(18)} ETH`);
        results.push({ address, balance: balanceEth });
      } catch (error) {
        console.error(`Failed to fetch balance for ${address}:`, error);
        results.push({ address, balance: "Error" });
      }

      // Introduce a random delay between 1 and 5 seconds
      const randomTimeout = Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;
      console.log(`Waiting for ${randomTimeout}ms before checking the next address...`);
      await delay(randomTimeout);
    }

    // Summarize results in a table format
    console.log("\nSummary of Wallet Balances:");
    console.table(
      results.map((result) => ({
        Address: result.address,
        Balance: result.balance === "Error" ? "Error" : `${result.balance.toFixed(18)} ETH`,
      }))
    );

    // Calculate the total ETH balance (excluding errors)
    const totalEth = results
      .filter((result) => result.balance !== "Error") // Exclude errors
      .reduce((sum, result) => sum + result.balance, 0);

    console.log(`\nTotal ETH Balance: ${totalEth.toFixed(18)} ETH`);
  } catch (error) {
    console.error("Failed to read addresses file:", error);
  }
}

// Execute the function
checkBalances();
