import { Router } from 'itty-router';

// Create router
const router = Router();

// CORS Headers helper
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

// Helper to send JSON responses with CORS headers
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders,
  });
}

// Health check endpoint
router.get('/api/health', () => {
  return json({ status: 'ok', service: 'flashcard-worker' });
});

// GET all quizzes (optional - list quiz IDs)
router.get('/api/quizzes', async (req, env) => {
  try {
    // Get all quiz keys from KV store
    const list = await env.QUIZZES.list();
    const quizzes = [];

    for (const item of list.keys) {
      const quiz = await env.QUIZZES.get(item.name, 'json');
      quizzes.push(quiz);
    }

    return json({ success: true, quizzes });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return json({ error: 'Failed to fetch quizzes', details: error.message }, 500);
  }
});

// POST create new quiz
router.post('/api/quizzes', async (req, env) => {
  try {
    const body = await req.json();
    const { title, questions } = body;

    // Validation
    if (!title || !questions || questions.length === 0) {
      return json(
        { error: 'Title and questions are required' },
        400
      );
    }

    // Generate unique quiz ID
    const quizId = 'quiz_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    // Create quiz object
    const quiz = {
      id: quizId,
      title,
      questions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store in KV with 30-day TTL (2,592,000 seconds)
    await env.QUIZZES.put(quizId, JSON.stringify(quiz), {
      expirationTtl: 2592000,
    });

    return json(
      {
        success: true,
        quiz: {
          id: quizId,
          title,
          questionCount: questions.length,
          createdAt: quiz.createdAt,
        },
      },
      201
    );
  } catch (error) {
    console.error('Error creating quiz:', error);
    return json(
      {
        error: 'Failed to create quiz',
        details: error.message,
      },
      500
    );
  }
});

// GET quiz by ID
router.get('/api/quizzes/:id', async (req, env) => {
  try {
    const { id } = req.params;
    const quiz = await env.QUIZZES.get(id, 'json');

    if (!quiz) {
      return json({ error: 'Quiz not found' }, 404);
    }

    return json({ success: true, quiz });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return json(
      {
        error: 'Failed to fetch quiz',
        details: error.message,
      },
      500
    );
  }
});

// PUT update quiz (optional)
router.put('/api/quizzes/:id', async (req, env) => {
  try {
    const { id } = req.params;
    const body = await req.json();
    const { title, questions } = body;

    // Get existing quiz
    const existing = await env.QUIZZES.get(id, 'json');
    if (!existing) {
      return json({ error: 'Quiz not found' }, 404);
    }

    // Update quiz
    const updated = {
      ...existing,
      title: title || existing.title,
      questions: questions || existing.questions,
      updatedAt: new Date().toISOString(),
    };

    await env.QUIZZES.put(id, JSON.stringify(updated), {
      expirationTtl: 2592000,
    });

    return json({
      success: true,
      quiz: updated,
    });
  } catch (error) {
    console.error('Error updating quiz:', error);
    return json(
      {
        error: 'Failed to update quiz',
        details: error.message,
      },
      500
    );
  }
});

// DELETE quiz
router.delete('/api/quizzes/:id', async (req, env) => {
  try {
    const { id } = req.params;

    // Check if exists
    const existing = await env.QUIZZES.get(id);
    if (!existing) {
      return json({ error: 'Quiz not found' }, 404);
    }

    // Delete from KV
    await env.QUIZZES.delete(id);

    return json({
      success: true,
      message: 'Quiz deleted',
    });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    return json(
      {
        error: 'Failed to delete quiz',
        details: error.message,
      },
      500
    );
  }
});

// POST create backup
router.post('/api/backup', async (req, env) => {
  try {
    const body = await req.json();
    const { userId, timestamp, data } = body;

    // Validation
    if (!userId || !data) {
      return json(
        { error: 'userId and data are required' },
        400
      );
    }

    // Generate unique backup ID
    const backupId = 'backup_' + userId + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    // Create backup object
    const backup = {
      id: backupId,
      userId,
      timestamp: timestamp || new Date().toISOString(),
      data,
      createdAt: new Date().toISOString(),
    };

    // Store in BACKUPS namespace with 90-day TTL (7,776,000 seconds)
    const backupsKV = env.BACKUPS || env.QUIZZES;
    await backupsKV.put(backupId, JSON.stringify(backup), {
      expirationTtl: 7776000,
    });

    return json(
      {
        success: true,
        backupId,
        timestamp: backup.timestamp,
        message: 'Backup created successfully',
      },
      201
    );
  } catch (error) {
    console.error('Error creating backup:', error);
    return json(
      {
        error: 'Failed to create backup',
        details: error.message,
      },
      500
    );
  }
});

// GET backup by ID
router.get('/api/backup/:id', async (req, env) => {
  try {
    const { id } = req.params;
    const backupsKV = env.BACKUPS || env.QUIZZES;
    const backup = await backupsKV.get(id, 'json');

    if (!backup) {
      return json({ error: 'Backup not found' }, 404);
    }

    return json({ success: true, backup });
  } catch (error) {
    console.error('Error fetching backup:', error);
    return json(
      {
        error: 'Failed to fetch backup',
        details: error.message,
      },
      500
    );
  }
});

// DELETE backup
router.delete('/api/backup/:id', async (req, env) => {
  try {
    const { id } = req.params;
    const backupsKV = env.BACKUPS || env.QUIZZES;

    // Check if exists
    const existing = await backupsKV.get(id);
    if (!existing) {
      return json({ error: 'Backup not found' }, 404);
    }

    // Delete from KV
    await backupsKV.delete(id);

    return json({
      success: true,
      message: 'Backup deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting backup:', error);
    return json(
      {
        error: 'Failed to delete backup',
        details: error.message,
      },
      500
    );
  }
});

// GET all backups for a user
router.get('/api/backups/:userId', async (req, env) => {
  try {
    const { userId } = req.params;
    const backupsKV = env.BACKUPS || env.QUIZZES;
    const list = await backupsKV.list({ prefix: `backup_${userId}_` });
    const backups = [];

    for (const item of list.keys) {
      const backup = await backupsKV.get(item.name, 'json');
      if (backup) {
        backups.push({
          id: backup.id,
          timestamp: backup.timestamp,
          createdAt: backup.createdAt,
          size: JSON.stringify(backup.data).length,
        });
      }
    }

    // Sort by timestamp (newest first)
    backups.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return json({ success: true, userId, backupCount: backups.length, backups });
  } catch (error) {
    console.error('Error fetching user backups:', error);
    return json(
      {
        error: 'Failed to fetch backups',
        details: error.message,
      },
      500
    );
  }
});

// POST submit quiz results (store in a results KV namespace)
router.post('/api/submit', async (req, env) => {
  try {
    const body = await req.json();
    const { quizId, answers, studentName, studentId, score, totalQuestions } = body;

    // Validation
    if (!quizId || !answers) {
      return json(
        { error: 'quizId and answers are required' },
        400
      );
    }

    // Generate unique result ID
    const resultId = `result_${quizId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create result object
    const result = {
      id: resultId,
      quizId,
      answers,
      studentName: studentName || 'Anonymous',
      studentId: studentId || 'unknown',
      score: score || 0,
      totalQuestions: totalQuestions || answers.length,
      submittedAt: new Date().toISOString(),
    };

    // Store in KV with 90-day TTL (7,776,000 seconds)
    // Using RESULTS namespace if available, otherwise QUIZZES
    const resultsKV = env.RESULTS || env.QUIZZES;
    await resultsKV.put(resultId, JSON.stringify(result), {
      expirationTtl: 7776000,
    });

    return json(
      {
        success: true,
        result: {
          id: resultId,
          quizId,
          score,
          totalQuestions,
          submittedAt: result.submittedAt,
        },
      },
      201
    );
  } catch (error) {
    console.error('Error submitting quiz results:', error);
    return json(
      {
        error: 'Failed to submit quiz results',
        details: error.message,
      },
      500
    );
  }
});

// GET quiz results by ID
router.get('/api/results/:id', async (req, env) => {
  try {
    const { id } = req.params;
    const resultsKV = env.RESULTS || env.QUIZZES;
    const result = await resultsKV.get(id, 'json');

    if (!result) {
      return json({ error: 'Result not found' }, 404);
    }

    return json({ success: true, result });
  } catch (error) {
    console.error('Error fetching result:', error);
    return json(
      {
        error: 'Failed to fetch result',
        details: error.message,
      },
      500
    );
  }
});

// GET all results for a quiz
router.get('/api/quizzes/:quizId/results', async (req, env) => {
  try {
    const { quizId } = req.params;
    const resultsKV = env.RESULTS || env.QUIZZES;
    const list = await resultsKV.list({ prefix: `result_${quizId}_` });
    const results = [];

    for (const item of list.keys) {
      const result = await resultsKV.get(item.name, 'json');
      if (result) {
        results.push(result);
      }
    }

    return json({ success: true, quizId, resultCount: results.length, results });
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    return json(
      {
        error: 'Failed to fetch quiz results',
        details: error.message,
      },
      500
    );
  }
});

// Handle CORS preflight requests
router.options('*', () => {
  return new Response(null, {
    headers: corsHeaders,
  });
});

// 404 handler
router.all('*', () => {
  return json(
    {
      error: 'Not found',
      available: [
        'GET /api/health',
        'GET /api/quizzes',
        'POST /api/quizzes',
        'GET /api/quizzes/:id',
        'PUT /api/quizzes/:id',
        'DELETE /api/quizzes/:id',
        'POST /api/submit',
        'GET /api/results/:id',
        'GET /api/quizzes/:quizId/results',
        'POST /api/backup',
        'GET /api/backup/:id',
        'DELETE /api/backup/:id',
        'GET /api/backups/:userId',
      ],
    },
    404
  );
});

// Export handler
export default {
  fetch: (request, env, ctx) => router.handle(request, env, ctx),
};
