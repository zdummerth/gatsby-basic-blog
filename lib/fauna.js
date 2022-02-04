import faunadb, { Cos } from 'faunadb'
import { v4 as uuidv4 } from 'uuid';
const {
    Let,
    Call,
    Function,
    Create,
    Update,
    CurrentIdentity,
    Intersection,
    Select,
    Var,
    Ref,
    Collection,
    Map,
    Logout,
    Tokens,
    Match,
    Index,
    Exists,
    If,
    Get,
    Paginate,
    Union,
    Lambda,
    Foreach,
    Delete,
    Do,
    Equals,
    Abort
} = faunadb.query

const graphqlEndpoint = `https://graphql.fauna.com/graphql`
const queryFaunaGraphql = async ({ query, variables, secret }) => {

    console.log({ variables })
    const res = await fetch(graphqlEndpoint, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${secret}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-Schema-Preview': 'partial-update-mutation'
        },
        body: JSON.stringify({
            query,
            variables
        })
    })

    // const json1 = await res.json()
    // console.log('response from graphql fetcher', res)
    if (res.status === 200) {
        const json = await res.json()
        // console.log('json from graphql fetcher', json)
        if (json.errors) {
            // console.log('errors from graphql fetcher', json.errors)
            throw json.errors[0].message

        } else {
            return json.data
        }
    } else {
        throw new Error("There was an error in fetching the graphql graphqlEndpoint")
    }
}

const _taskDeleteCascade = (taskRefs) => (
    Foreach(taskRefs, Lambda("taskRef", Let({},
        {
            deletedTask: Delete(Var("taskRef")),
            assignedTo: Foreach(Paginate(
                Match(Index("task_assignedTo_search_by_task"), Var("taskRef"))),
                Lambda('assignedToDoc', Delete(Var("assignedToDoc"))))
        })))
)

export const deleteCommentsCascade = async ({ id, secret }) => {
    // const client = new faunadb.Client({ secret: process.env.FAUNA_SERVER_KEY })
    const client = new faunadb.Client({ secret })
    return await client.query(
        Let(
            {
                projectRef: Ref(Collection("Project"), id),
                tasks: Select("data", Paginate(Match(Index("project_tasks_by_project"), Var("projectRef")))),
                invites: Select("data", Paginate(Match(Index("invites_search_by_project"), Var("projectRef")))),
                projectMembers: Select("data", Paginate(Match(Index("project_member_search_by_project"), Var("projectRef")))),
            },
            Do(
                // Foreach(Var("tasks"), Lambda("taskRef", Let({},
                //     {
                //         deletedTask: Delete(Var("taskRef")),
                //         assignedTo: Foreach(Paginate(
                //             Match(Index("task_assignedTo_search_by_task"), Var("taskRef"))),
                //             Lambda('assignedToDoc', Delete(Var("assignedToDoc"))))
                //     }))),
                _taskDeleteCascade(Var("tasks")),
                Foreach(Var("invites"), Lambda("invite", Delete(Var("invite")))),
                Foreach(Var("projectMembers"), Lambda("member", Delete(Var("member")))),
                Select(["ref", "id"], Delete(Var("projectRef")))
            )
        )
    )
}



export const createComment = async ({ fromId, toId, projectId, secret }) => await queryFaunaGraphql({
    variables: {
        fromId, toId, projectId,
    },
    secret,
    query: `mutation($data: CreateCommentInput) {
        createComment(data: $data) {
          _id
        }
      }`
})

export const deleteComment = async ({ id, secret }) => await queryFaunaGraphql({
    variables: {
        id,
    },
    secret,
    query: `mutation($id: ID!) {
        deleteComment(id: $id) {
          _id
        }
      }`
})

export const login = async (email, secret) => {
    const client = new faunadb.Client({ secret })
    return await client.query(
        Let(
            {
                accountExists: Exists(Match(Index("unique_Account_email"), email))
            },
            If(
                Var("accountExists"),
                Let(
                    {
                        accountDoc: Get(Match(Index("unique_Account_email"), email)),
                        accountRef: Select("ref", Var("accountDoc")),
                        userRef: Select(["data", "user"], Var("accountDoc"))
                    },
                    {
                        accessToken: Select(
                            "secret",
                            Create(Tokens(), { instance: Var("accountRef") })
                        ),
                        accountId: Select(["ref", "id"], Var("accountDoc")),
                        userId: Select(["id"], Var("userRef")),
                        email: Select(["data", "email"], Var("accountDoc")),
                        isNewUser: false
                    }
                ),
                Let(
                    {

                        newAccountDoc: Create(Collection("Account"), {
                            data: {
                                email,
                                user: Select("ref", Create(Collection("User"), {
                                    data: {
                                        handle: uuidv4()
                                    }
                                }))
                            }
                        }),
                        newAccountRef: Select("ref", Var("newAccountDoc")),
                        userRef: Select(["data", "user"], Var("newAccountDoc"))
                    },
                    {
                        accessToken: Select(
                            "secret",
                            Create(Tokens(), { instance: Var("newAccountRef") })
                        ),
                        accountId: Select(["ref", "id"], Var("newAccountDoc")),
                        userId: Select(["id"], Var("userRef")),
                        email: Select(["data", "email"], Var("newAccountDoc")),
                        isNewUser: true
                    }
                )
            )
        )
    )
}

export const logout = async (secret) => {
    const client = new faunadb.Client({ secret })
    const q = faunadb.query
    return await client.query(
        Logout(true)
    )
}
