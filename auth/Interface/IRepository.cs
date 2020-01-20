﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using MongoDB.Bson;
using MongoDB.Driver;

namespace STS.Interface
{
    /// <summary>
    /// Basic interface with a few methods for adding, deleting, and querying data.
    /// </summary>
    public interface IRepository
    {
        System.Linq.IQueryable<T> All<T>() where T : class, new();
        IFindFluent<T, T> Find<T>(BsonDocument doc) where T : class, new();
        IQueryable<T> Where<T>(System.Linq.Expressions.Expression<Func<T, bool>> expression) where T : class, new();
        T Single<T>(Expression<Func<T, bool>> expression) where T : class, new();
        void Delete<T>(Expression<Func<T, bool>> expression) where T : class, new();
        void Add<T>(T item) where T : class, new();
        void Add<T>(IEnumerable<T> items) where T : class, new();
        bool CollectionExists<T>() where T : class, new();
        void Update<T>(string id, IDictionary<string, object> set) where T : class, new();
        void Replace<T>(System.Linq.Expressions.Expression<Func<T, bool>> expression, T replaceValue) where T : class, new();
    }
}