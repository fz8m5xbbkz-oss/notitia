export type BlueskyPost = {
  text: string;
  datum: Date;
  url: string;
};

const HANDLE = 'luis-57.bsky.social';
const API = 'https://public.api.bsky.app/xrpc';

export async function ladeBlueskyPosts(limit = 3): Promise<BlueskyPost[]> {
  try {
    const url = `${API}/app.bsky.feed.getAuthorFeed?actor=${HANDLE}&limit=20&filter=posts_no_replies`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const json: any = await res.json();

    return (json.feed ?? [])
      .filter((eintrag: any) => !eintrag.reason)
      .slice(0, limit)
      .map((eintrag: any) => {
        const post = eintrag.post;
        const rkey = post.uri.split('/').pop();
        return {
          text: post.record?.text ?? '',
          datum: new Date(post.record?.createdAt ?? Date.now()),
          url: `https://bsky.app/profile/${HANDLE}/post/${rkey}`,
        };
      });
  } catch (fehler) {
    console.warn('[bluesky] Posts konnten nicht geladen werden:', fehler);
    return [];
  }
}
