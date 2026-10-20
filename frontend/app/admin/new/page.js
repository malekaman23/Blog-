import RequireAdmin from "../../../components/RequireAdmin";
import PostForm from "../../../components/PostForm";

export default function NewPost() {
  return (
    <RequireAdmin>
      <section className="max-w-6xl mx-auto px-6 py-10">
        <p className="text-xs uppercase tracking-wide font-semibold text-muted mb-1">Admin</p>
        <h1 className="font-display text-3xl font-semibold text-ink mb-8">New article</h1>
        <PostForm />
      </section>
    </RequireAdmin>
  );
}
