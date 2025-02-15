export default function handler(req, res) {
    console.log('API route hit!'); // Add this for debugging
    res.status(200).json({ message: 'Hello from API!' });
  }