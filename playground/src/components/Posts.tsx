/**
 * Copyright 2024 Aubin REBILLAT
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { $effect, $state, For } from "palta";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: {
    color: string;
    type: string;
  };
  ip: string;
  address: {
    address: string;
    city: string;
    state: string;
    stateCode: string;
    postalCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    country: string;
  };
  macAddress: string;
  university: string;
  bank: {
    cardExpire: string;
    cardNumber: string;
    cardType: string;
    currency: string;
    iban: string;
  };
  company: {
    department: string;
    name: string;
    title: string;
    address: {
      address: string;
      city: string;
      state: string;
      stateCode: string;
      postalCode: string;
      coordinates: {
        lat: number;
        lng: number;
      };
      country: string;
    };
  };
  ein: string;
  ssn: string;
  userAgent: string;
  crypto: {
    coin: string;
    wallet: string;
    network: string;
  };
  role: "admin" | "moderator" | "user";
};

type Post = {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;
  userId: number;
  user: User;
};

type PostResponse = {
  posts: Omit<Post, "user">[];
  total: number;
  skip: number;
  limit: number;
};

// @Palta.component
function Post(post: Post) {
  return (
    <div className="flex flex-col border p-2 gap-2 rounded shadow">
      <h3 className="text-lg font-medium">{post.title}</h3>
      <hr />
      <div>{post.body}</div>
      <hr />
      <div className="flex justify-between">
        <div>{`By ${post.user.firstName} ${post.user.lastName}`}</div>
        <div className="flex gap-2">
          <div>
            {post.reactions.likes > 0
              ? `${post.reactions.likes} like`
              : "No likes"}
          </div>
          <div>
            {post.reactions.likes > 0
              ? `${post.reactions.dislikes} dislike`
              : "No dislikes"}
          </div>
        </div>
      </div>
    </div>
  );
}

// @Palta.component
export default function Posts({ search }: { search: string }) {
  const [posts, setPosts] = $state<Post[]>([]);
  const [isLoading, setIsLoading] = $state<boolean>(false);

  $effect(async () => {
    setIsLoading(true);
    fetch(
      search
        ? `https://dummyjson.com/posts/search?q=${search}&limit=10`
        : `https://dummyjson.com/posts?limit=10`
    )
      .then((response) => response.json())
      .then(async (data: PostResponse) => {
        const users: User[] = await Promise.all(
          data.posts.map((p) =>
            fetch(`https://dummyjson.com/users/${p.userId}`).then((response) =>
              response.json()
            )
          )
        );
        setPosts(
          data.posts.map((p, i) => ({
            ...p,
            user: users[i],
          }))
        );
        setIsLoading(false);
      });
  }, [search]);

  return (
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Posts</h2>
        {isLoading ? (
          <>
            <p>Loading...</p>
            <hr />
          </>
        ) : (
          <For each={posts} component={Post} key={(p) => p.id} />
        )}
      </div>
  );
}
