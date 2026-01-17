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
      ],
    },
    404
  );
});

// Export handler
export default {
  fetch: (request, env, ctx) => router.handle(request, env, ctx),
};
