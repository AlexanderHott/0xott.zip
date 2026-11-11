use std::{
    cell::UnsafeCell,
    collections::VecDeque,
    mem::MaybeUninit,
    sync::atomic::{AtomicUsize, Ordering::SeqCst},
};

use rand::{Rng, RngExt};

struct Spsc<'m> {
    buffer: &'m mut [UnsafeCell<MaybeUninit<f32>>],
    read: AtomicUsize,
    write: AtomicUsize,
}

struct SpscReader<'m> {
    queue: &'m Spsc<'m>,
}
struct SpscWriter<'m> {
    queue: &'m Spsc<'m>,
}

impl<'m> Spsc<'m> {
    fn new(buffer: &'m mut [UnsafeCell<MaybeUninit<f32>>]) -> Self {
        assert!(!buffer.is_empty(), "Invalid buffer size");
        Self {
            buffer,
            read: AtomicUsize::new(0),
            write: AtomicUsize::new(0),
        }
    }

    fn split(&'m mut self) -> (SpscWriter<'m>, SpscReader<'m>) {
        let queue: &Spsc = &*self;

        (SpscWriter { queue }, SpscReader { queue })
    }
}

fn next(index: usize, len: usize) -> usize {
    assert!(index < len);
    if index + 1 == len { 0 } else { index + 1 }
}

impl<'m> SpscWriter<'m> {
    fn try_push(&mut self, value: f32) -> Result<(), f32> {
        let q = self.queue;
        let write = q.write.load(SeqCst);
        let write_next = next(write, q.buffer.len());

        if write_next == q.read.load(SeqCst) {
            return Err(value);
        }

        unsafe {
            (*q.buffer[write].get()).write(value);
        }

        q.write.store(write_next, SeqCst);
        Ok(())
    }
}

impl<'m> SpscReader<'m> {
    fn try_pop(&mut self) -> Option<f32> {
        let q = self.queue;
        let read = q.read.load(SeqCst);

        if read == q.write.load(SeqCst) {
            return None;
        }

        let value = unsafe { (*q.buffer[read].get()).assume_init_read() };

        q.read.store(next(read, q.buffer.len()), SeqCst);
        Some(value)
    }
}

fn fuzz() {
    let mut rng = rand::rng();

    let capacity = 2u32.pow(rng.random_range(2..=10)) as usize;

    let mut buffer: Box<[UnsafeCell<MaybeUninit<f32>>]> = (0..capacity)
        .map(|_| UnsafeCell::new(MaybeUninit::uninit()))
        .collect::<Vec<_>>()
        .into_boxed_slice();

    let mut queue = Spsc::new(&mut buffer);

    let (mut writer, mut reader) = queue.split();

    let mut vecdeque = VecDeque::<f32>::with_capacity(capacity);

    let iterations: usize = rng.random_range(0..=100_000);
    let op_split: f64 = rng.random_range(0.0..=1.0);

    for _ in 0..iterations {
        if rng.random_bool(op_split) {
            let value: f32 = rng.next_u32() as f32;

            if let Ok(()) = writer.try_push(value) {
                vecdeque.push_back(value);
            }
        } else {
            assert_eq!(reader.try_pop(), vecdeque.pop_front());
        }
    }

    while let Some(value) = vecdeque.pop_front() {
        assert_eq!(reader.try_pop().unwrap(), value);
    }
    assert_eq!(reader.try_pop(), None);

    println!("Fuzz complete! cap={capacity} iter={iterations}");
}

fn main() {
    for _ in 0..100 {
        fuzz();
    }
}
