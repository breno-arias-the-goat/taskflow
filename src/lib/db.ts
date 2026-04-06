import {
  collection, doc, setDoc, updateDoc, deleteDoc,
  query, where, orderBy, onSnapshot
} from 'firebase/firestore'
import { db } from './firebase'
import type { Workspace, Task, Note } from './types'

const now = () => Date.now()

export const workspacesRef = (uid: string) => collection(db, 'users', uid, 'workspaces')
export const tasksRef      = (uid: string) => collection(db, 'users', uid, 'tasks')
export const notesRef      = (uid: string) => collection(db, 'users', uid, 'notes')

export async function createWorkspace(uid: string, data: Omit<Workspace, 'id'|'createdAt'|'updatedAt'>) {
  const ref = doc(workspacesRef(uid))
  const ws = { ...data, id: ref.id, createdAt: now(), updatedAt: now() }
  await setDoc(ref, ws); return ws
}

export async function createTask(uid: string, data: Omit<Task, 'id'|'createdAt'|'updatedAt'>) {
  const ref = doc(tasksRef(uid))
  const t = { ...data, id: ref.id, createdAt: now(), updatedAt: now() }
  await setDoc(ref, t); return t
}

export async function updateTask(uid: string, taskId: string, data: Partial<Task>) {
  await updateDoc(doc(tasksRef(uid), taskId), { ...data, updatedAt: now() })
}

export async function deleteTask(uid: string, taskId: string) {
  await deleteDoc(doc(tasksRef(uid), taskId))
}

export function listenTasks(uid: string, wsId: string, cb: (t: Task[]) => void) {
  const q = query(tasksRef(uid), where('workspaceId', '==', wsId), orderBy('order'))
  return onSnapshot(q, snap => cb(snap.docs.map(d => d.data() as Task)))
}

export function listenWorkspaces(uid: string, cb: (ws: Workspace[]) => void) {
  return onSnapshot(workspacesRef(uid), snap => cb(snap.docs.map(d => d.data() as Workspace)))
}

export async function createNote(uid: string, data: Omit<Note, 'id'|'createdAt'|'updatedAt'>) {
  const ref = doc(notesRef(uid))
  const n = { ...data, id: ref.id, createdAt: now(), updatedAt: now() }
  await setDoc(ref, n); return n
}

export async function updateNote(uid: string, noteId: string, data: Partial<Note>) {
  await updateDoc(doc(notesRef(uid), noteId), { ...data, updatedAt: now() })
}

export async function deleteNote(uid: string, noteId: string) {
  await deleteDoc(doc(notesRef(uid), noteId))
}

export function listenNotes(uid: string, wsId: string, cb: (n: Note[]) => void) {
  const q = query(notesRef(uid), where('workspaceId', '==', wsId), orderBy('createdAt', 'desc'))
  return onSnapshot(q, snap => cb(snap.docs.map(d => d.data() as Note)))
}
