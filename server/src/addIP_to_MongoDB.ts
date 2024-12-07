import axios from 'axios';
import dotenv from 'dotenv'

dotenv.config()

// MongoDB Atlas API details
const atlasPublicKey : string = process.env.PUBLIC_KEY // Replace with your Atlas public key
const atlasPrivateKey : string= process.env.PRIVATE_KEY // Replace with your Atlas private key
const projectId = process.env.PROJECT_ID  // Replace with your Atlas project ID
const clusterName = process.env.CLUSTER_NAME  // Replace with your cluster name

interface AccessListData {
  ipAddress: string;
  comment: string;
}

export async function addIpToAtlas(): Promise<void> {
  try {
    // Get the current public IP address
    const publicIp=await import('public-ip')
    //@ts-ignore
    const ip = await publicIp.v4();
    console.log(`Current public IP: ${ip}`);

    // Prepare the request to add IP to MongoDB Atlas
    const url = `https://cloud.mongodb.com/api/atlas/v1.0/groups/${projectId}/accessList`;
    const auth = {
      username: atlasPublicKey,
      password: atlasPrivateKey,
    };

    // Create the data payload
    const data: AccessListData = {
      ipAddress: ip,
      comment: 'Added via script',
    };

    // Send a request to MongoDB Atlas API to add the IP
    const response = await axios.post(url, data, { auth });
    console.log('IP added to Atlas:', response.data);
  } catch (error: any) {
    console.error('Error adding IP to Atlas:', error.message);
  }
}

// Run the function to add IP to MongoDB Atlas
addIpToAtlas();
