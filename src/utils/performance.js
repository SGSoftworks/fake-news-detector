// Utilidades de optimización de rendimiento

// Debounce function para optimizar llamadas frecuentes
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function para limitar la frecuencia de ejecución
export const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Lazy loading para componentes
export const lazyLoad = importFunc => {
  return React.lazy(() => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(importFunc());
      }, 100);
    });
  });
};

// Memoización para funciones costosas
export const memoize = fn => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
};

// Optimización de imágenes
export const optimizeImage = (file, maxWidth = 800, quality = 0.8) => {
  return new Promise(resolve => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(resolve, "image/jpeg", quality);
    };

    img.src = URL.createObjectURL(file);
  });
};

// Compresión de datos para almacenamiento
export const compressData = data => {
  try {
    const jsonString = JSON.stringify(data);
    return btoa(jsonString);
  } catch (error) {
    console.error("Error comprimiendo datos:", error);
    return data;
  }
};

// Descompresión de datos
export const decompressData = compressedData => {
  try {
    const jsonString = atob(compressedData);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error descomprimiendo datos:", error);
    return compressedData;
  }
};

// Preload de recursos críticos
export const preloadResource = (url, type = "image") => {
  return new Promise((resolve, reject) => {
    if (type === "image") {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    } else if (type === "script") {
      const script = document.createElement("script");
      script.onload = () => resolve(script);
      script.onerror = reject;
      script.src = url;
      document.head.appendChild(script);
    }
  });
};

// Optimización de scroll
export const optimizeScroll = (callback, options = {}) => {
  const { throttleMs = 16, passive = true } = options;

  let ticking = false;
  const throttledCallback = throttle(callback, throttleMs);

  return function (event) {
    if (!ticking) {
      requestAnimationFrame(() => {
        throttledCallback(event);
        ticking = false;
      });
      ticking = true;
    }
  };
};

// Cache de resultados de análisis
export class AnalysisCache {
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });
  }

  get(key) {
    const item = this.cache.get(key);
    if (item) {
      // Actualizar timestamp de acceso
      item.timestamp = Date.now();
      return item.value;
    }
    return null;
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

// Optimización de renderizado de listas
export const virtualizeList = (items, itemHeight, containerHeight) => {
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(window.scrollY / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount, items.length);

  return {
    visibleItems: items.slice(startIndex, endIndex),
    startIndex,
    endIndex,
    totalHeight: items.length * itemHeight,
    offsetY: startIndex * itemHeight,
  };
};

// Medición de rendimiento
export const measurePerformance = (name, fn) => {
  return (...args) => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();

    if (process.env.NODE_ENV === "development") {
      console.log(`${name} took ${(end - start).toFixed(2)}ms`);
    }

    return result;
  };
};

// Optimización de búsqueda
export const createSearchIndex = (items, fields) => {
  const index = new Map();

  items.forEach((item, id) => {
    fields.forEach(field => {
      const value = item[field];
      if (value) {
        const words = value.toLowerCase().split(/\s+/);
        words.forEach(word => {
          if (!index.has(word)) {
            index.set(word, new Set());
          }
          index.get(word).add(id);
        });
      }
    });
  });

  return index;
};

export const searchWithIndex = (index, query, items) => {
  const words = query.toLowerCase().split(/\s+/);
  const resultSets = words.map(word => {
    const matches = new Set();
    for (const [indexWord, ids] of index.entries()) {
      if (indexWord.includes(word)) {
        ids.forEach(id => matches.add(id));
      }
    }
    return matches;
  });

  const intersection = resultSets.reduce((acc, set) => {
    return new Set([...acc].filter(id => set.has(id)));
  });

  return Array.from(intersection).map(id => items[id]);
};
