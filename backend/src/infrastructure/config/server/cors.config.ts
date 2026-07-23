const allowed_origins = [
  "https://notes-6auc.onrender.com",
  "https://notes-flame-gamma.vercel.app",
  "http://localhost:5173",
];

export const cors_options = {
  origin: allowed_origins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
