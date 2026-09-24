import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot 
} from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../firebase';
import { 
  MahilaMember, 
  DonationRecord, 
  JamanwarPlan, 
  SabhaEvent, 
  EmailNotification 
} from '../types';
import { 
  INITIAL_MEMBERS, 
  INITIAL_DONATIONS, 
  INITIAL_JAMANWAR_PLANS, 
  INITIAL_SABHA_EVENTS, 
  INITIAL_NOTIFICATIONS 
} from '../data/initialData';

// Firestore collection paths
const COLLECTIONS = {
  MEMBERS: 'members',
  DONATIONS: 'donations',
  JAMANWARS: 'jamanwars',
  SABHAS: 'sabhas',
  NOTIFICATIONS: 'notifications'
} as const;

/**
 * Recursively strips undefined fields from an object so Firestore setDoc never throws
 * "Function setDoc() called with invalid data. Unsupported field value: undefined".
 */
export function cleanFirestoreData<T extends Record<string, any>>(data: T): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) {
      continue;
    }
    if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
      if (Array.isArray(value)) {
        result[key] = value
          .filter(item => item !== undefined)
          .map(item => (item !== null && typeof item === 'object' && !(item instanceof Date) ? cleanFirestoreData(item) : item));
      } else {
        result[key] = cleanFirestoreData(value);
      }
    } else {
      result[key] = value;
    }
  }
  return result;
}

/**
 * Initialize Firestore with default seed data if collections are currently empty.
 */
export async function initializeFirestoreSeedData(): Promise<void> {
  try {
    const membersSnap = await getDocs(collection(db, COLLECTIONS.MEMBERS));
    if (membersSnap.empty) {
      console.log('Seeding initial members to Firestore...');
      for (const member of INITIAL_MEMBERS) {
        await setDoc(doc(db, COLLECTIONS.MEMBERS, member.id), cleanFirestoreData(member));
      }
    }

    const donationsSnap = await getDocs(collection(db, COLLECTIONS.DONATIONS));
    if (donationsSnap.empty) {
      console.log('Seeding initial donations to Firestore...');
      for (const donation of INITIAL_DONATIONS) {
        await setDoc(doc(db, COLLECTIONS.DONATIONS, donation.id), cleanFirestoreData(donation));
      }
    }

    const jamanwarsSnap = await getDocs(collection(db, COLLECTIONS.JAMANWARS));
    if (jamanwarsSnap.empty) {
      console.log('Seeding initial jamanwar plans to Firestore...');
      for (const plan of INITIAL_JAMANWAR_PLANS) {
        await setDoc(doc(db, COLLECTIONS.JAMANWARS, plan.id), cleanFirestoreData(plan));
      }
    }

    const sabhasSnap = await getDocs(collection(db, COLLECTIONS.SABHAS));
    if (sabhasSnap.empty) {
      console.log('Seeding initial sabha events to Firestore...');
      for (const sabha of INITIAL_SABHA_EVENTS) {
        await setDoc(doc(db, COLLECTIONS.SABHAS, sabha.id), cleanFirestoreData(sabha));
      }
    }

    const notifsSnap = await getDocs(collection(db, COLLECTIONS.NOTIFICATIONS));
    if (notifsSnap.empty) {
      console.log('Seeding initial notifications to Firestore...');
      for (const notif of INITIAL_NOTIFICATIONS) {
        await setDoc(doc(db, COLLECTIONS.NOTIFICATIONS, notif.id), cleanFirestoreData(notif));
      }
    }
  } catch (error) {
    console.error('Notice: Firestore seeding check:', error);
  }
}

/**
 * Subscribes to real-time updates for all collections
 */
export function subscribeToAllCollections(callbacks: {
  onMembers: (members: MahilaMember[]) => void;
  onDonations: (donations: DonationRecord[]) => void;
  onJamanwars: (jamanwars: JamanwarPlan[]) => void;
  onSabhas: (sabhas: SabhaEvent[]) => void;
  onNotifications: (notifications: EmailNotification[]) => void;
}) {
  const unsubMembers = onSnapshot(
    collection(db, COLLECTIONS.MEMBERS),
    (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs.map(d => d.data() as MahilaMember);
        callbacks.onMembers(data);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, COLLECTIONS.MEMBERS);
    }
  );

  const unsubDonations = onSnapshot(
    collection(db, COLLECTIONS.DONATIONS),
    (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs.map(d => d.data() as DonationRecord);
        callbacks.onDonations(data);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, COLLECTIONS.DONATIONS);
    }
  );

  const unsubJamanwars = onSnapshot(
    collection(db, COLLECTIONS.JAMANWARS),
    (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs.map(d => d.data() as JamanwarPlan);
        callbacks.onJamanwars(data);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, COLLECTIONS.JAMANWARS);
    }
  );

  const unsubSabhas = onSnapshot(
    collection(db, COLLECTIONS.SABHAS),
    (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs.map(d => d.data() as SabhaEvent);
        callbacks.onSabhas(data);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, COLLECTIONS.SABHAS);
    }
  );

  const unsubNotifs = onSnapshot(
    collection(db, COLLECTIONS.NOTIFICATIONS),
    (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs.map(d => d.data() as EmailNotification);
        // sort latest first
        data.sort((a, b) => b.id.localeCompare(a.id));
        callbacks.onNotifications(data);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, COLLECTIONS.NOTIFICATIONS);
    }
  );

  return () => {
    unsubMembers();
    unsubDonations();
    unsubJamanwars();
    unsubSabhas();
    unsubNotifs();
  };
}

// Write Operations with error handlers
export async function saveMemberToFirestore(member: MahilaMember): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.MEMBERS, member.id), cleanFirestoreData(member));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTIONS.MEMBERS}/${member.id}`);
  }
}

export async function saveDonationToFirestore(donation: DonationRecord): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.DONATIONS, donation.id), cleanFirestoreData(donation));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTIONS.DONATIONS}/${donation.id}`);
  }
}

export async function saveJamanwarToFirestore(jamanwar: JamanwarPlan): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.JAMANWARS, jamanwar.id), cleanFirestoreData(jamanwar));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTIONS.JAMANWARS}/${jamanwar.id}`);
  }
}

export async function saveSabhaToFirestore(sabha: SabhaEvent): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.SABHAS, sabha.id), cleanFirestoreData(sabha));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTIONS.SABHAS}/${sabha.id}`);
  }
}

export async function saveNotificationToFirestore(notification: EmailNotification): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.NOTIFICATIONS, notification.id), cleanFirestoreData(notification));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTIONS.NOTIFICATIONS}/${notification.id}`);
  }
}
