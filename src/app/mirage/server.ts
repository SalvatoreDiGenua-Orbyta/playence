import { createServer, Model, Factory, belongsTo, hasMany, Response } from 'miragejs';
import { faker } from '@faker-js/faker';

export function makeServer() {
  return createServer({
    models: {
      user: Model.extend({}),
      event: Model.extend({ coach: belongsTo(), tickets: hasMany() }),
      coach: Model.extend({}),
      ticket: Model.extend({ user: belongsTo(), event: belongsTo() }),
      performance: Model.extend({ user: belongsTo(), event: belongsTo() }),
    },

    factories: {
      user: Factory.extend({
        name: () => faker.person.fullName(),
        email: () => faker.internet.email(),
        phone: () => faker.phone.number(),
        preferredSports: () => faker.helpers.arrayElements(
          ['Calcio', 'Tennis', 'Nuoto', 'Ciclismo', 'Pallacanestro', 'Padel', 'Running', 'Yoga', 'CrossFit'],
          faker.number.int({ min: 1, max: 3 })
        ),
        createdAt: () => faker.date.past({ years: 1 }).toISOString(),
      }),

      coach: Factory.extend({
        name: () => faker.person.fullName(),
        sport: () => faker.helpers.arrayElement(['Calcio', 'Tennis', 'Nuoto', 'Ciclismo', 'Pallacanestro', 'Padel', 'Running', 'Yoga', 'CrossFit']),
        bio: () => faker.lorem.paragraph(),
        isVip: () => faker.datatype.boolean(),
        image: () => `https://randomuser.me/api/portraits/${faker.helpers.arrayElement(['men', 'women'])}/${faker.number.int({ min: 1, max: 99 })}.jpg`,
        rating: () => faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }),
      }),

      event: Factory.extend({
        title: () => faker.lorem.words(3),
        sport: () => faker.helpers.arrayElement(['Calcio', 'Tennis', 'Nuoto', 'Ciclismo', 'Pallacanestro', 'Padel', 'Running', 'Yoga', 'CrossFit']),
        cost: () => faker.number.int({ min: 20, max: 500 }),
        date: () => faker.date.future({ years: 1 }).toISOString(),
        duration: () => faker.helpers.arrayElement([60, 90, 120, 180, 240]),
        location: () => `${faker.location.city()}, ${faker.location.country()}`,
        experience: () => faker.helpers.arrayElement(['Principiante', 'Intermedio', 'Avanzato', 'Agonistico']),
        hasVip: () => faker.datatype.boolean(),
        maxParticipants: () => faker.number.int({ min: 10, max: 100 }),
        currentParticipants: () => faker.number.int({ min: 0, max: 50 }),
        description: () => faker.lorem.paragraphs(2),
        image: () => `https://picsum.photos/seed/${faker.string.alphanumeric(6)}/800/600`,
        coverImage: () => `https://picsum.photos/seed/${faker.string.alphanumeric(6)}/1200/800`,
        tags: () => faker.helpers.arrayElements(['outdoor', 'indoor', 'team', 'solo', 'competitivo', 'ricreativo'], 2),
      }),

      performance: Factory.extend({
        heartRateAvg: () => faker.number.int({ min: 110, max: 180 }),
        heartRateMax: () => faker.number.int({ min: 160, max: 200 }),
        caloriesBurned: () => faker.number.int({ min: 200, max: 1200 }),
        distanceKm: () => faker.number.float({ min: 0, max: 20, fractionDigits: 1 }),
        durationMinutes: () => faker.number.int({ min: 30, max: 240 }),
        coachComment: () => faker.lorem.sentences(3),
        aiAnalysis: () => faker.lorem.paragraphs(2),
        performanceScore: () => faker.number.int({ min: 40, max: 100 }),
        date: () => faker.date.past({ years: 1 }).toISOString(),
      }),
    },

    seeds(server) {
      const coaches = server.createList('coach', 10);

      coaches.forEach(coach => {
        server.createList('event', faker.number.int({ min: 1, max: 4 }), { coach });
      });

      const testUser = server.create('user', {
        email: 'test@playence.it',
        password: 'password123',
        name: 'Mario Rossi',
        phone: '+39 333 1234567',
        preferredSports: ['Calcio', 'Tennis'],
        createdAt: new Date().toISOString(),
      } as any);

      const allEvents = server.schema.all('event').models;
      if (allEvents.length >= 2) {
        // Evento 1: Recente (dati e AI visibili)
        server.create('ticket', {
          userId: testUser.id,
          eventId: allEvents[0].id,
          participant: { firstName: 'Mario', lastName: 'Rossi', email: 'test@playence.it' },
          status: 'confirmed'
        } as any);

        server.create('performance', {
          userId: testUser.id,
          eventId: allEvents[0].id,
          date: new Date().toISOString(),
          performanceScore: 88,
          heartRateAvg: 145,
          heartRateMax: 180,
          caloriesBurned: 650,
          distanceKm: 8.5,
          durationMinutes: 60,
          coachComment: 'Ottima sessione, progressione costante e buon recupero finale.',
          aiAnalysis: 'Il battito medio di 145 bpm indica un ottimo allenamento in soglia aerobica. Mantieni questo passo e aumenta i tempi di defaticamento del 10% per un recupero ottimale.'
        } as any);

        // Evento 2: Vecchio di 8 mesi (dati bloccati in UI come simulazione storico account gratuito/premium)
        server.create('ticket', {
          userId: testUser.id,
          eventId: allEvents[1].id,
          participant: { firstName: 'Mario', lastName: 'Rossi', email: 'test@playence.it' },
          status: 'confirmed'
        } as any);

        server.create('performance', {
          userId: testUser.id,
          eventId: allEvents[1].id,
          date: new Date('10/02/2025').toISOString(),
          performanceScore: 72,
          heartRateAvg: 160,
          heartRateMax: 195,
          caloriesBurned: 800,
          distanceKm: 12.0,
          durationMinutes: 90,
          coachComment: 'Buon ritmo nella prima metà ma calo vistoso alla fine. Attenzione a bilanciare lo sforzo.',
          aiAnalysis: 'Dispendio energetico elevato con picchi in fascia anaerobica ripetuti. Suggerito un lavoro specifico per migliorare la tolleranza all\'acido lattico.'
        } as any);
      }
    },

    routes() {
      this.namespace = 'api';
      this.timing = 400; // Simula latenza realistica

      this.post('/auth/login', (schema: any, request) => {
        const { email, password } = JSON.parse(request.requestBody);
        const user = schema.db.users.findBy({ email });
        if (user && password === 'password123') {
          return { token: btoa(user['id']), user };
        }
        return new Response(401, {}, { error: 'Credenziali non valide' });
      });

      this.post('/auth/register', (schema: any, request) => {
        const attrs = JSON.parse(request.requestBody);
        const user = schema.create('user', { ...attrs, createdAt: new Date().toISOString() });
        return { token: btoa(user['id']), user };
      });

      this.get('/events', (schema: any, request) => {
        const { sport, minCost, maxCost, experience, location, hasVip, dateFrom, dateTo } = request.queryParams;
        let events = schema.all('event').models;

        if (sport) events = events.filter((e: any) => e.sport === sport);
        if (minCost) events = events.filter((e: any) => e.cost >= Number(minCost));
        if (maxCost) events = events.filter((e: any) => e.cost <= Number(maxCost));
        if (experience) events = events.filter((e: any) => e.experience === experience);
        if (location) events = events.filter((e: any) => e.location.toLowerCase().includes(String(location).toLowerCase()));
        if (hasVip === 'true') events = events.filter((e: any) => e.hasVip);
        if (dateFrom) events = events.filter((e: any) => new Date(e.date) >= new Date(String(dateFrom)));
        if (dateTo) events = events.filter((e: any) => new Date(e.date) <= new Date(String(dateTo)));

        events = events.map((e: any) => {
          const eventAttrs = { ...e.attrs };
          if (e.coach) {
            eventAttrs.coach = e.coach.attrs;
          }
          return eventAttrs;
        });

        return { events, total: events.length };
      });

      this.get('/events/:id', (schema: any, request) => {
        const e = schema.find('event', request.params['id']);
        const eventAttrs = { ...e.attrs };
        if (e.coach) {
          eventAttrs.coach = e.coach.attrs;
        }
        return eventAttrs;
      });

      this.post('/tickets', (schema: any, request) => {
        const attrs = JSON.parse(request.requestBody);
        const tickets = attrs.participants.map((participant: any) => {
          return schema.create('ticket', {
            eventId: attrs.eventId,
            userId: attrs.userId,
            participant,
            purchasedAt: new Date().toISOString(),
            status: 'confirmed',
          });
        });
        return { tickets, confirmationCode: `SC-${Math.random().toString(36).substr(2, 9).toUpperCase()}` };
      });

      this.get('/users/:id/tickets', (schema: any, request) => {
        return schema.where('ticket', { userId: request.params['id'] }).models;
      });

      this.get('/users/:id/performances', (schema: any, request) => {
        return schema.where('performance', { userId: request.params['id'] }).models;
      });

      this.get('/events/:id/performances/average', (schema: any, request) => {
        const perfs = schema.where('performance', { eventId: request.params['id'] }).models;
        if (!perfs.length) return { average: null };

        const avg = {
          heartRateAvg: Math.round(perfs.reduce((s: any, p: any) => s + p.heartRateAvg, 0) / perfs.length),
          caloriesBurned: Math.round(perfs.reduce((s: any, p: any) => s + p.caloriesBurned, 0) / perfs.length),
          distanceKm: +(perfs.reduce((s: any, p: any) => s + p.distanceKm, 0) / perfs.length).toFixed(1),
          performanceScore: Math.round(perfs.reduce((s: any, p: any) => s + p.performanceScore, 0) / perfs.length),
        };
        return { average: avg, participantsCount: perfs.length };
      });

      this.post('/performances/:id/ai-analysis', (schema: any, request) => {
        const { performanceData } = JSON.parse(request.requestBody);
        return {
          analysis: `Analisi AI: La tua sessione ha mostrato un'ottima resistenza cardiovascolare con un FC media di ${performanceData?.heartRateAvg} bpm. Il tuo score di ${performanceData?.performanceScore}/100 indica margini di miglioramento nella fase finale dell'allenamento.`,
          trainingPlan: [
            { week: 1, focus: 'Resistenza base', sessions: ['30 min corsa leggera', 'Stretching 20 min', 'Yoga 45 min'] },
            { week: 2, focus: 'Forza funzionale', sessions: ['HIIT 25 min', 'Pesi corpo 30 min', 'Recovery 20 min'] },
            { week: 3, focus: 'Intensità progressiva', sessions: ['Interval training 35 min', 'Core 20 min', 'Nuoto 30 min'] },
            { week: 4, focus: 'Picco performance', sessions: ['Test performance 45 min', 'Defaticamento 30 min', 'Analisi progressi'] },
          ],
          suggestions: [
            'Aumenta l\'idratazione durante le sessioni ad alta intensità',
            'Incorpora 10 minuti di respirazione diaframmatica dopo ogni allenamento',
            'Considera di aggiungere un giorno di recupero attivo con attività a bassa intensità',
          ],
        };
      });

      this.get('/coaches', (schema: any) => schema.all('coach'));
      this.get('/coaches/:id', (schema: any, request) => schema.find('coach', request.params['id']));
    },
  });
}
