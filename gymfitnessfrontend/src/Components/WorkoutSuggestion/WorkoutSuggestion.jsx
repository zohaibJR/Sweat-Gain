import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../../config/api';
import './WorkoutSuggestion.css';

function WorkoutSuggestion() {
  const email = localStorage.getItem('userEmail') || '';
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSuggestion = useCallback(async () => {
    if (!email) {
      setError('Could not determine the logged-in user.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(apiUrl('/api/ai/suggest-workout'), {
        params: { email },
      });
      setPlan(response.data);
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to generate your workout right now.';
      setError(message);
      setPlan(null);
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    fetchSuggestion();
  }, [fetchSuggestion]);

  return (
    <section className="WorkoutSuggestionCard">
      <div className="WorkoutSuggestionTop">
        <div>
          <div className="WorkoutSuggestionEyebrow">AI Coach</div>
          <h2 className="WorkoutSuggestionTitle">Today&apos;s Workout Plan</h2>
        </div>
        <button
          type="button"
          className="WorkoutSuggestionButton"
          onClick={fetchSuggestion}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Regenerate'}
        </button>
      </div>

      {loading ? (
        <p className="WorkoutSuggestionState">Generating your workout...</p>
      ) : error ? (
        <div className="WorkoutSuggestionError">
          <p>{error}</p>
        </div>
      ) : (
        <div className="WorkoutSuggestionContent">
          <div className="WorkoutSuggestionFocusRow">
            <span className="WorkoutSuggestionLabel">Focus</span>
            <span className="WorkoutSuggestionFocus">{plan?.focus}</span>
          </div>

          <ul className="WorkoutSuggestionList">
            {(plan?.exercises || []).map((exercise) => (
              <li key={exercise}>{exercise}</li>
            ))}
          </ul>

          <p className="WorkoutSuggestionNote">{plan?.note}</p>
        </div>
      )}
    </section>
  );
}

export default WorkoutSuggestion;
