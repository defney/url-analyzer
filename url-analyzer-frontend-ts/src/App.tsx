// src/App.tsx
import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Stack,
  Checkbox,
} from '@mui/material';
import ResultDetail from './ResultDetail';

interface Result {
  id?: number;
  url: string;
  title: string;
  html_version: string;
  h1: number;
  h2: number;
  h3: number;
  h4: number;
  h5: number;
  h6: number;
  internal_links: number;
  external_links: number;
  has_login_form: boolean;
  broken_links?: { url: string; status: number | string }[];
}

function AppContent() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [allResults, setAllResults] = useState<Result[]>([]);
  const [fetchTriggered, setFetchTriggered] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.fromDetail) {
      fetchAllResults();
    }
  }, [location]);

  const handleSubmit = async () => {
    if (!url.trim()) {
      alert('⚠️ Please enter a URL.');
      return;
    }

    if (!/^https?:\/\//.test(url)) {
      alert('⚠️ Please enter a valid URL (must start with https://)');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/analyze', { url });
      setResult(response.data);
    } catch (error: any) {
      const message =
        error?.response?.data?.detail ||
        error?.message ||
        'An unexpected error occurred.';
      alert('❌ Error: ' + message);
    }
  };

  const fetchAllResults = async () => {
    try {
      const response = await axios.get('http://localhost:8000/results');
      setAllResults(response.data);
    } catch (err) {
      alert('Error fetching results.');
    }
  };

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    setAllResults((prev) => prev.filter((r) => !selectedIds.includes(r.id!)));
    setSelectedIds([]);
  };

  const handleReanalyzeSelected = async () => {
    const selected = allResults.filter((r) => selectedIds.includes(r.id!));
    for (const r of selected) {
      try {
        await axios.post('http://localhost:8000/analyze', { url: r.url });
      } catch (err) {
        console.error(`Error reanalyzing ${r.url}`);
      }
    }
    setSelectedIds([]);
    fetchAllResults();
  };

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          🔎 URL Analyzer (TypeScript)
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField
            fullWidth
            label="Enter a URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button variant="contained" onClick={handleSubmit}>
            Analyze
          </Button>
          <Button variant="outlined" onClick={() => {
            fetchAllResults();
            setFetchTriggered(true);
          }}>
            Fetch All
          </Button>
        </Stack>

        {result && (
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Latest Result
            </Typography>

            <Box
              className="latest-result-card"
            >
              <Typography><strong>URL:</strong> {result.url}</Typography>
              <Typography><strong>Title:</strong> {result.title}</Typography>
              <Typography><strong>HTML Version:</strong> {result.html_version}</Typography>
              <Typography><strong>Login Form Detected:</strong> {result.has_login_form ? 'Yes' : 'No'}</Typography>

              <Box mt={2}>
                <Typography variant="subtitle1"><strong>Headings Count:</strong></Typography>
                <Typography>H1: {result.h1}</Typography>
                <Typography>H2: {result.h2}</Typography>
                <Typography>H3: {result.h3}</Typography>
                <Typography>H4: {result.h4}</Typography>
                <Typography>H5: {result.h5}</Typography>
                <Typography>H6: {result.h6}</Typography>
              </Box>

              <Box mt={2}>
                <Typography variant="subtitle1"><strong>Links:</strong></Typography>
                <Typography>Internal: {result.internal_links}</Typography>
                <Typography>External: {result.external_links}</Typography>
              </Box>
            </Box>
          </Box>
        )}

        {selectedIds.length > 0 && (
          <Stack direction="row" spacing={2} mt={4} mb={2}>
            <Button color="error" variant="contained" onClick={handleDeleteSelected}>
              🗑️ Delete Selected
            </Button>
            <Button color="primary" variant="outlined" onClick={handleReanalyzeSelected}>
              🔁 Re-analyze Selected
            </Button>
          </Stack>
        )}

        <Box mt={4}>
          {allResults.map((r) => (
<Box key={r.id} className="result-box">

              <Checkbox
                checked={selectedIds.includes(r.id!)}
                onClick={(e) => e.stopPropagation()}
                onChange={() => toggleSelection(r.id!)}
              />
              <Box
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate('/detail', { state: { result: r } })}
              >
                <Typography color="primary">
                  {r.url} – {r.title} ({r.internal_links} internal links)
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppContent />} />
      <Route path="/detail" element={<ResultDetail />} />
    </Routes>
  );
}

export default App;
